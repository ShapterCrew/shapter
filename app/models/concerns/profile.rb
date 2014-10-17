module Profile
  extend ActiveSupport::Concern

  included do 
    has_and_belongs_to_many :profile_boxes, class_name: "ProfileBox", inverse_of: :users
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

  def profile_box_recommandation(n=10)
    if (not_empty = profile.not.where(tag_ids: nil)).any?
      last_ts = not_empty.last.tag_ids
      next_pb_ids = ProfileBoxItem.all_in(tag_ids: last_ts).where(:tag_ids.with_size => last_ts.size).only(:next_1_id).flat_map(&:next_1_id).compact.uniq

      enhance_next_ids = ProfileBoxItem.not.where(next_1_id: nil).any_in(tag_ids: school_ids).where(name: /#{profile.last.name}/).only(:next_1_id).flat_map(&:next_1_id).compact
      next_ids = (next_pb_ids + enhance_next_ids).uniq.compact

      box_tag_ids = ProfileBoxItem.not.where(tag_ids: nil).only(:tag_ids).find(next_ids)
    else
      prom_bud_ids = schools.only(:student_ids).flat_map(&:student_ids)
      box_tag_ids = ProfileBoxItem.not.where(tag_ids: nil).any_in(user_ids: prom_bud_ids).where(prev_1_id: nil).only(:tag_ids)
    end


    already_boxed = profile_boxes.not.where(tag_ids: nil).only(:tag_ids).map(&:tag_ids).map(&:sort).uniq.compact || []

    popular_ids = box_tag_ids.group_by(&:tag_ids)
    .reject{|k,v| already_boxed.include? k.sort}
    .map{|k,v| [k,v.size]}
    .sort_by(&:last).reverse
    .map(&:first)
    .take(n)


    suggested_boxes = popular_ids.map do |ids|
      ProfileBox.new(
        tag_ids: ids,
        name: ProfileBox.name_for(ids),
        user_ids: [self.id],
      )
    end

  end

end
