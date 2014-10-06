class ProfileBoxInternship < ProfileBox

  belongs_to :internship

  validates_presence_of :internship_id
  before_validation :set_users

  def tag_ids
    internship.tags.where(category: "type").only(:id).map(&:id)
  end

  private

  def set_users
    self.users = [internship.trainee]
  end

end
