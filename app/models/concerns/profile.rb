module Profile
  extend ActiveSupport::Concern

  included do 
    has_and_belongs_to_many :profile_boxes, class_name: "ProfileBox", inverse_of: :user
  end

  def profile
    profile_boxes.asc(:start_date)
  end

  # Will (re)compute chained lists to order the user's ProfileBoxes
  def order_profile!
    ary = profile
    ary.each_with_index do |pb,i|

      prev = (i == 0 ? nil : ary[i-1].id)
      nnext = (i == ary.size - 1 ? nil : ary[i+1].id)

      pb.update_attribute(:next_1_id, nnext ) unless pb.next_1_id == nnext
      pb.update_attribute(:prev_1_id, prev) unless pb.prev_1_id == prev
    end
  end


end

