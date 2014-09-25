# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :internship do
    title "fancy internship title"
    start_date {Date.today}
    end_date {Date.today + 3}
    trainee_ids {[BSON::ObjectId.new]}
    address "35 rue de la boustifaille"
    location {[48.856638, 2.352241]}
  end
end
