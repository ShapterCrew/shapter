class Internship
  include Mongoid::Document

  field :title
  field :start_date, type: Date
  field :end_date, type: Date
  field :address
  field :location

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

  def skills
    tags.skills
  end

  def long
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

end
