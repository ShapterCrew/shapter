require 'ostruct'
module Shapter
  module V7
    class CourseBuilder < Grape::API
      format :json

      before do 
        check_confirmed_account!
      end

      namespace :users do
        namespace ":user_id" do 
          before do 
            params do 
              requires :user_id, type: String, desc: "id of the user"
            end
            @user = User.find(params[:user_id])
          end

          namespace :courses do 


          end
        end
      end
    end

  end
end
