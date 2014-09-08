# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :tag do
    name "foo"
    type "footype"
    category_id {Category.new.id}
  end
end
