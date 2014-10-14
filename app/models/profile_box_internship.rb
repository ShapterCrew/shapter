class ProfileBoxInternship < ProfileBox

  belongs_to :internship

  validates_presence_of :internship_id
  before_validation :save_floating_attributes!

  def compute_tag_ids
    internship.tags.where(category: "type").only(:id).map(&:id)
  end

  def type
    "internship"
  end

  def name
    internship.title
  end

  def users
    internship.trainees
  end

  def start_date
    internship.start_date
  end

  def end_date
    internship.end_date
  end

  private
  def save_floating_attributes!
    self.user_ids = internship.trainee_ids
    users.each{|u| u.update_attribute(:profile_box_ids, (u.profile_box_ids << self.id).uniq)}
    self.name = name
    self.type = type
    self.start_date = start_date
    self.end_date = end_date
  end

end
