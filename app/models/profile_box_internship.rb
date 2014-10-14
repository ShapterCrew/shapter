class ProfileBoxInternship < ProfileBox

  belongs_to :internship

  validates_presence_of :internship_id

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

end
