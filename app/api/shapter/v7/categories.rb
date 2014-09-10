module Shapter
  module V7
    class Categories < Grape::API
      format :json

      before do 
        check_confirmed_account!
      end

      namespace :categories do 

        desc "index: get a list  of categories"
        post do 
          present :categories, Tag.acceptable_categories
        end

      end
    end
  end
end
