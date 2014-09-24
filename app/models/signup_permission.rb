class SignupPermission
  include Mongoid::Document

  field :email, type: String

  field :school_names, type: Array

  field :firstname, type: String
  field :lastname, type: String

  validates_presence_of :school_names
  validates_presence_of :email

  validates_uniqueness_of :email

  after_create :send_email
  after_create :touch_user_if_possible

  before_validation :downcase_email

  def pretty_id
    id.to_s
  end

  protected
  def downcase_email
    self.email = self.email.downcase if self.email
  end

  def send_email
    SignupPermissionMailer.send_user_email(email, school_names).deliver
  end

  def touch_user_if_possible
    if u = User.find_by(email: email)
      u.save
    end
  end

end
