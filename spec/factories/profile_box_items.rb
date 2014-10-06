# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :profile_box_item do
    user_ids {[BSON::ObjectId.new]}
    name "foo"
  end
end
