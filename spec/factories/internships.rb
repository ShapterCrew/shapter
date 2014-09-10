# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :internship do
    title "fancy internship title"
    start_date {Date.today}
    end_date {Date.today + 3}
    trainee_id {BSON::ObjectId.new}
  end
end
