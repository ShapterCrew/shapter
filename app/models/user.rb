class User
  include Mongoid::Document
  include Mongoid::Timestamps

  include Facebookable
  include Skilled
  include Schools
  include Profile
  include CanRecommend

  field :firstname, type: String
  field :lastname,  type: String
  field :shapter_admin, type: Boolean

  has_and_belongs_to_many :internships, class_name: "Internship", inverse_of: :trainee

  has_and_belongs_to_many :liked_comments, class_name: "Item", inverse_of: :likers
  has_and_belongs_to_many :disliked_comments, class_name: "Item", inverse_of: :dislikers

  has_and_belongs_to_many :liked_documents, class_name: "Item", inverse_of: :likers
  has_and_belongs_to_many :disliked_documents, class_name: "Item", inverse_of: :dislikers

  has_and_belongs_to_many :items, class_name: "Item", inverse_of: :subscribers
  has_and_belongs_to_many :cart_items, class_name: "Item", inverse_of: :interested_users
  has_and_belongs_to_many :constructor_items, class_name: "Item", inverse_of: :constructor_users

  has_and_belongs_to_many :schools, class_name: "Tag", inverse_of: :students

  has_many :syllabus_edited_items, class_name: "Item", inverse_of: :syllabus_author
  has_many :reported_comments, class_name: "Report", inverse_of: :reporter

  # {{{ devise
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :confirmable
  devise :omniauthable, :omniauth_providers => [:facebook]

  ## Database authenticatable
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count,      type: Integer, default: 0
  field :current_sign_in_at, type: Time
  field :last_sign_in_at,    type: Time
  field :current_sign_in_ip, type: String
  field :last_sign_in_ip,    type: String

  ## Confirmable
  field :confirmation_token,   type: String
  field :confirmed_at,         type: Time
  field :confirmation_sent_at, type: Time
  field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time

  #}}}

  def sign_in_json
    {
      id: id.to_s,
      email: email,
      firstname: firstname,
      lastname: lastname,
      schools: schools.map{|s| {id: s.id.to_s, name: s.name}},
      admin: shapter_admin,
      confirmed: confirmed?,
      sign_in_count: sign_in_count,
    }.to_json
  end

  def pretty_id
    id.to_s
  end

  #only own email can be viewed
  def public_email(who_asks)
    if who_asks == self
      email
    else
      "hidden"
    end
  end

  # Users should share at least one school to see each other's names
  def public_firstname(who_asks)
    raise "public_firstname: #{who_asks} is no User" unless who_asks.is_a? User
    if ((who_asks.confirmed_account? and ( who_asks.shapter_admin or (who_asks.schools & self.schools).any? or self.is_friend_with?(who_asks) )) or who_asks == self)
      firstname
    else
      "student"
    end
  end

  # Users should share at least one school to see each other's names
  def public_lastname(who_asks)
    raise "public_lastname: #{who_asks} is no User" unless who_asks.is_a? User
    if ((who_asks.confirmed_account? and (who_asks.shapter_admin or (who_asks.schools & self.schools).any? or self.is_friend_with?(who_asks))) or who_asks == self)
      lastname
    else
      schools.any? ? "from #{schools.first.name}" : ""
    end
  end

  # Users should share at least one school to see each other's names
  def public_image(who_asks)
    raise "public_lastname: #{who_asks} is no User" unless who_asks.is_a? User
    if ((who_asks.confirmed_account? and (who_asks.shapter_admin or (who_asks.schools & self.schools).any? or self.is_friend_with?(who_asks))) or who_asks == self)
      image
    else
      nil
    end
  end

  def name
    [firstname, lastname].compact.map(&:capitalize).join(" ")
  end

  def valid_password?(pwd)
    begin
      super(pwd)
    rescue
      Pbkdf2PasswordHasher.check_password(pwd,self.encrypted_password)
    end
  end

  validates_uniqueness_of :email
  before_validation :set_names!

  after_save :items_touch
  after_save :comments_touch
  after_save :tags_touch

  before_create :skip_confirmation_notification!
  after_create :send_confirmation_if_required
  after_create :track_signup_if_valid_student!
  after_create :send_welcome_email

  def track_signup_if_valid_student!
    if confirmed_student?
      Behave.delay.identify self.id.to_s,
        email: self.email,
        firstname: self.firstname || "unknown",
        lastname: self.lastname || "unknown",
        name: [self.firstname, self.lastname].join(" ") || "unknown",
        schools: self.schools.map(&:name) || "unknown",
        provider: self.provider, #|| "null",
        picture: self.image #|| "null"

      Behave.delay.track self.id.to_s, "signup"
    end
  end

  def send_confirmation_if_required
    #no need to confirm facebook users
    unless self.provider == "facebook"
      #if self.class.schools_for(self.email).any?
        self.send_confirmation_instructions
      #end
    end
  end

  def comments
    Rails.cache.fetch("userComms|#{id}|#{updated_at.try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      Item.where("comments.author_id" => self.id).flat_map{|i| i.comments.where(author: self)}
    end
  end

  def comments_count
    comments.size
  end

  def items_count
    item_ids.count
  end

  def comments_likes_count
    comments.map(&:likers_count).reduce(:+)
  end

  def comments_dislikes_count
    comments.map(&:dislikers_count).reduce(:+)
  end

  def diagrams_count
    Rails.cache.fetch("usrDiagCnt|#{id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 1.hours) do 
      Item.where("diagrams.author_id" => id).count
    end
  end

  def user_diagram
    Rails.cache.fetch("userDiag|#{id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 1.hours) do 
      unless (diags = items.map(&:raw_avg_diag) ).empty?
        d = (diags.reduce(:+) / diags.map(&:count_els).reduce(:+)).fill_with(50)
        d.item = items.first
      else
        d = Diagram.new_empty
      end
    d
    end
  end

  def confirmed_account?
    confirmed? or provider == "facebook"
  end

  def confirmed_student?
    return true if ( provider == "facebook" and schools.any? and facebook_email == email) # signed up with facebook email, that matched a signup permission or regex
    return true if confirmed? and schools.any? # already confirmed an email, that gave a school
    false
  end

  def track_login!
    Behave.delay.track pretty_id, "login"
  end

  private

  def send_welcome_email
    WelcomeMailer.delay(run_at: 1.hours.from_now).welcome_user(self)
  end

  def items_touch
    items.each(&:touch) 
  end

  def comments_touch
    liked_comments.each(&:touch)
    disliked_comments.each(&:touch)
  end

  def tags_touch
    schools.each(&:touch) if school_ids_changed? or new_record?
  end

  def set_names!
    if perm = SignupPermission.find_by(email: self.email)
      self.firstname ||= perm.firstname if perm.firstname
      self.lastname  ||= perm.firstname if perm.lastname
    end
  end

  def confirmation_required?
    false
  end

end
