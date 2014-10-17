class Internship
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title
  field :start_date, type: Date
  field :end_date, type: Date
  field :address
  field :location
  field :description

  include Autocomplete

  has_and_belongs_to_many :tags
  has_and_belongs_to_many :trainees, class_name: "User", inverse_of: :internships # This allows queries such as User.not.where(internship_ids: nil) to find user with internships

  has_one :profile_box_internship

  #{{{ validations
  validates_presence_of :start_date, :end_date, :trainee_ids, :title, :location
  validate :dates_validation
  def dates_validation
    errors.add(:base,"end_date should be greater than start_date") if start_date >= end_date
  end
  #}}}

  def public_description(who_ask)
    #ENSMA hack
    return description if tags.schools.map(&:open_school?).reduce(:|)
    #/ENSMA hack

    if who_ask.confirmed_account? and (prom_buddy?(who_ask) or fb_friend?(who_ask) or who_ask.shapter_admin)
      description
    else
      "hidden"
    end
  end
  
  def trainee
    trainees.first
  end

  def duration
    (end_date - start_date).to_i
  end

  def name
    title
  end

  def skills
    tags.skills
  end

  def lng
    location.first
  end

  def lat
    location.last
  end

  def pretty_id
    id.to_s
  end

  def in_progress?
    start_date <= Date.today and end_date >= Date.today
  end

  class << self
    def acceptable_categories
      [
        "skill",
        "school",
        "geo",
        "company",
        "company_size",
        "domain",
        "position",
        "type",
      ]
    end
  end

  after_save :tags_touch
  after_save :user_touch

  after_create :create_profile_box
  after_destroy :delete_profile_box

  private

  def create_profile_box
    p = ProfileBoxInternship.new(internship: self)
    p.save
  end

  def delete_profile_box
    profile_box_internship.destroy if profile_box_internship
  end

  def tags_touch
    tags.each(&:touch) if tags.any?
  end

  def user_touch
    trainee.touch unless trainee.nil?
  end

  def prom_buddy?(who_ask)
    (trainee.schools & who_ask.schools).any?
  end

  def fb_friend?(who_ask)
    trainee.is_friend_with?(who_ask)
  end

end
