class Internship
  include Mongoid::Document

  field :title
  field :start_date, type: Date
  field :end_date, type: Date

  belongs_to :trainee, class_name: "User", inverse_of: :internships

  #{{{ validations
  validates_presence_of :start_date, :end_date, :trainee_id
  validate :dates_validation
  def dates_validation
    errors.add(:base,"end_date should be greater than start_date") if start_date >= end_date
  end
  #}}}

  def duration
    (end_date - start_date).to_i
  end

  class << self
    def acceptable_categories
      [
        "skill",
        "school",
        "geo",
        "internship_name",
        "company",
        "company_size",
        "domain",
        "job",
      ]
    end
  end

end
