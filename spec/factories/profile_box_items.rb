# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :profile_box_item do
    user_ids {[BSON::ObjectId.new]}
    name "foo"
    start_date {Date.today}
    end_date {Date.today + 3}
  end
end
