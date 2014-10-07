class ProfileBoxItem < ProfileBox

  field :item_ids, type: Array

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

  def tag_ids
    items.map(&:tag_ids).reduce(:&)
  end

end
