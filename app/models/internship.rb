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
  belongs_to :trainee, class_name: "User", inverse_of: :internships

  #{{{ validations
  validates_presence_of :start_date, :end_date, :trainee_id, :title, :location
  validate :dates_validation
  def dates_validation
    errors.add(:base,"end_date should be greater than start_date") if start_date >= end_date
  end
  #}}}

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
      ]
    end
  end

  after_save :tags_touch
  after_save :user_touch

  private
  def tags_touch
    tags.each(&:touch) if tags.any?
  end

  def user_touch
    trainee.touch unless trainee.nil?
  end

end
