# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :profile_box_internship do
    name "foo"
    internship_id {BSON::ObjectId.new}
  end
end
