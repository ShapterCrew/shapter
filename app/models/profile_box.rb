#Abstract class 
class ProfileBox
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :start_date, type: Date
  field :end_date  , type: Date

  field :type
  field :tag_ids, type: Array
  field :saved_tag_ids, type: Array

  has_and_belongs_to_many :users, class_name: "User", inverse_of: :profile_boxes

  validates_presence_of :name, :type, :users

  def tags
    tag_ids.blank? ? [] : Tag.find(tag_ids)
  end

  before_validation :set_tag_ids

  private

  def set_tag_ids
    self.saved_tag_ids = tag_ids
  end

end
