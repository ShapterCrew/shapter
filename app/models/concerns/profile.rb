module Profile
  extend ActiveSupport::Concern

  included do 
    has_and_belongs_to_many :profile_boxes, class_name: "ProfileBox", inverse_of: :user
  end

  def profile
    (internships_profile + items_profile).sort_by(&:start_date)
  end

  private

  def internships_profile
    self.internships.map do |internship|
      ProfileBoxInternship.new(internship: internship)
    end
  end

  def items_profile
    self.profile_boxes
  end

end

