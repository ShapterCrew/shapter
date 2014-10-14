# for users to recommend items
module CanRecommend
  extend ActiveSupport::Concern

  included do 
    has_and_belongs_to_many :recommended_items, class_name: "Item", inverse_of: "recommenders"
    has_and_belongs_to_many :unrecommended_items, class_name: "Item", inverse_of: "unrecommenders"
    has_and_belongs_to_many :norecommended_items, class_name: "Item", inverse_of: "norecommenders"
  end

  #{{{ reco_score_item!
  # user sets a recommendation score to an item
  def reco_score_item!(item,score)
    raise("score should be an integer in [0,3]") unless score.is_a? Integer and score < 4 and score > -1
    if score == 0
      self.unrecommended_items.delete(item)
      self.norecommended_items.delete(item)
      self.recommended_items.delete(item)
    elsif score == 1
      self.unrecommended_items << item
      self.norecommended_items.delete(item)
      self.recommended_items.delete(item)
    elsif score == 2
      self.unrecommended_items.delete(item)
      self.norecommended_items << item
      self.recommended_items.delete(item)
    elsif score == 3
      self.unrecommended_items.delete(item)
      self.norecommended_items.delete(item)
      self.recommended_items << item
    else
      raise "don't know what to do with score=#{score} of class #{score.class}"
    end

    if self.save and item.save
      item.touch #being paranoid with mongo callbacks...
      self.touch #being paranoid with mongo callbacks...
      return true
    else
      return false
    end


  end
  #}}}

  #{{{ item_reco_score
  # returns the score given by the user on an item
  def item_reco_score(item)
    return 3 if recommended_items.include? item
    return 2 if norecommended_items.include? item
    return 1 if unrecommended_items.include? item
    return 0
  end
  #}}}

end
