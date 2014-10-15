class ProfileBoxItem < ProfileBox

  field :item_ids, type: Array
  after_save :destroy_if_empty!

  after_save :update_user_items!
  before_destroy :delete_user_items!

  def type
    "items"
  end

  def items
    item_ids.blank? ? [] : Item.find(item_ids)
  end

  def add_item!(item)
    self.item_ids ||= []
    if item.is_a? Item
      self.item_ids = (self.item_ids + [item.id]).uniq
    elsif item.is_a? BSON::ObjectId
      self.item_ids = (self.item_ids + [item]).uniq
    elsif item.is_a? String
      self.item_ids = (self.item_ids + [BSON::ObjectId.from_string(item)]).uniq
    else
      raise "don't know how to add a #{item.class} to item_ids"
    end
  end

  def add_items!(items)
    items.each{|it| add_item!(it)}
  end

  def remove_item!(item)
    self.item_ids ||= []
    if item.is_a? Item
      self.item_ids = (self.item_ids - [item.id]).uniq
    elsif item.is_a? BSON::ObjectId
      self.item_ids = (self.item_ids - [item]).uniq
    elsif item.is_a? String
      self.item_ids = (self.item_ids - [BSON::ObjectId.from_string(item)]).uniq
    else
      raise "don't know how to remove a #{item.class} to item_ids"
    end
  end

  def remove_items!(items)
    items.each{|it| remove_item!(it)}
  end

  def compute_tag_ids
    items.map(&:tag_ids).reduce(:&)
  end

  private

  def destroy_if_empty!
    self.destroy if item_ids.blank?
  end

  def update_user_items!
    if item_ids_changed?
      old_ids = item_ids_was || []
      new_ids = item_ids || []

      missing_ids = old_ids - new_ids
      new_ids     = new_ids - old_ids

      u = user
      u.item_ids ||= []
      u.item_ids -= missing_ids
      u.item_ids += new_ids
      u.save
    end
  end

  def delete_user_items!
    unless item_ids.blank?
      user.item_ids ||= []
      user.item_ids -= item_ids
      user.save
    end
  end


end
