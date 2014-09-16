module Shapter
  module V7
    class Categories < Grape::API
      format :json

      before do 
        check_confirmed_account!
      end

      namespace :categories do 

        desc "index: get a list  of categories"
#        post do 
#          present :categories, Tag.acceptable_categories
#        end

        desc "index: get a list  of categories for items"
        post :for_items do 
          present :categories, Item.acceptable_categories
        end

        desc "index: get a list  of categories for internships"
        post :for_internships do 
          present :categories, Internship.acceptable_categories
        end

      end
    end
  end
end
