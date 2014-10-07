# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :profile_box_internship do
    name "foo"
    start_date {Date.today}
    end_date {Date.today + 5}
    internship_id {BSON::ObjectId.new}
  end
end
