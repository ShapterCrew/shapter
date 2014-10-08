#Abstract class 
class ProfileBox
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :type
  field :start_date, type: Date
  field :end_date  , type: Date

  field :tag_ids, type: Array

  field :next_1_id, type: BSON::ObjectId
  field :prev_1_id, type: BSON::ObjectId

  def pretty_id
    id.to_s
  end

  has_and_belongs_to_many :users, class_name: "User", inverse_of: :profile_boxes

  validates_presence_of :name, :users, :start_date

  def tags
    tag_ids.blank? ? [] : Tag.find(tag_ids)
  end

  def user
    users.first
  end

  before_validation :set_tag_ids

  after_save :order_user_profile!
  after_create :force_order_user_profile!
  after_destroy :force_order_user_profile!

  class << self

    #{{{ name_for
    # select the most popular name amongst an array of profile boxes, or simply take a random name if no name is popular
    def name_for(ary_of_tag_ids)
      ary_of_pbs = all_in(tag_ids: ary_of_tag_ids).where(:tag_ids.with_size => ary_of_tag_ids.size).only(:name)

      return Tag.only(:name).find(ary_of_tag_ids).map(&:name).join(" ; ") if ary_of_pbs.empty?

      sorted = ary_of_pbs.group_by(&:name).map{|k,v| [k,v.size]}.sort_by(&:last).reverse
      if sorted.first.last > 1
        sorted.first.first
      else
        ary_of_pbs.sample(1).first.name
      end
    end
    #}}}

  end

  private

  def order_user_profile!
    if start_date_changed?
      force_order_user_profile!
    end
  end

  def force_order_user_profile!
    #if Rails.env.production?
    #  user.delay.order_profile! if user
    #else
      user.order_profile! if user
    #end
  end

  def set_tag_ids
    self.tag_ids = compute_tag_ids
  end

end
