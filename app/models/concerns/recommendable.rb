# For items that can be recommended by users
module Recommendable
  extend ActiveSupport::Concern

  included do 
    has_and_belongs_to_many :recommenders, class_name: "User", inverse_of: :recommended_items
    has_and_belongs_to_many :unrecommenders, class_name: "User", inverse_of: :unrecommended_items
    has_and_belongs_to_many :norecommenders, class_name: "User", inverse_of: :norecommended_items
  end

  def user_reco_score(user)
    return 3 if recommenders.include? user
    return 2 if norecommenders.include? user
    return 1 if unrecommenders.include? user
    return 0
  end

end
