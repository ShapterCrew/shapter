module Shapter
  module V7
    class ProfileBoxes < Grape::API
      format :json

      namespace :profile_boxes do 

        #{{{ create
        desc "create a profile box to store items"
        params do 
          requires :name
          optional :start_date, type: Date,desc: "starting date"
          optional :end_date, type: Date, desc: "end date"
          requires :item_ids, type: Array, desc: "item_ids"
        end
        post :create do 
          check_confirmed_account!
          pb = ProfileBoxItem.new(
            name: params[:name],
            user_ids: [current_user.id],
            start_date: params[:start_date],
            end_date: params[:end_date],
          )

          pb.add_items!(params[:item_ids])

          if pb.save
            present pb, with: Shapter::Entities::ProfileBox, entity_options: entity_options
          else
            error!(pb.errors.messages)
          end

        end
        #}}}

        namespace ':id' do 
          before do 
            params do 
              requires :profile_box_id, desc: "id of the profile box"
            end
            @pb = ProfileBox.find(params[:profile_box_id])
          end
        end

        #{{{ update
        desc "update a profile box"
        put do 
        end
        #}}}

        #{{{ delete
        desc "delete a profile box"
        delete do 
        end
        #}}}

      end
    end
  end
end
