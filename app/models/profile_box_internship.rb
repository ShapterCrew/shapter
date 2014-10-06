class ProfileBoxInternship < ProfileBox

  belongs_to :internship

  validates_presence_of :internship_id
  after_initialize :set_users
  after_initialize :set_dates

  def tag_ids
    internship.tags.where(category: "type").only(:id).map(&:id)
  end

  def type
    "internship"
  end

  private

  def set_users
    self.users = [internship.trainee] if internship and internship.trainee
  end

  def set_dates
    self.start_date = internship.start_date if internship and internship.start_date
    self.end_date = internship.end_date if internship and internship.end_date
  end

end
