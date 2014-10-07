#Abstract class 
class ProfileBox
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :start_date, type: Date
  field :end_date  , type: Date

  field :saved_tag_ids, type: Array

  field :next_1_id, type: BSON::ObjectId
  field :prev_1_id, type: BSON::ObjectId

  def pretty_id
    id.to_s
  end

  has_and_belongs_to_many :users, class_name: "User", inverse_of: :profile_boxes

  validates_presence_of :name, :type, :users, :start_date

  def tags
    tag_ids.blank? ? [] : Tag.find(tag_ids)
  end

  def user
    users.first
  end

  before_validation :set_tag_ids

  after_save :order_user_profile!
  after_destroy :force_order_user_profile!

  private

  def order_user_profile!
    if new_record? or start_date_changed?
      force_order_user_profile!
    end
  end

  def force_order_user_profile!
    if Rails.env.test?
      user.order_profile! if user
    else
      user.delay.order_profile! if user
    end
  end

  def set_tag_ids
    self.saved_tag_ids = tag_ids
  end

end
