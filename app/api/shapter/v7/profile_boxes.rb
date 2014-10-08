module Shapter
  module V7
    class ProfileBoxes < Grape::API
      format :json

      namespace :users do 

        namespace ':user_id' do 
          before do 
            params do 
              requires :user_id, desc: "user id"
            end
            @user = User.find(params[:user_id]) || error!("user not found",404)
          end

          namespace :profile_boxes do 

            #{{{ index
            desc "get the profile boxes for a given user"
            post do 
              present @user.profile, with: Shapter::Entities::ProfileBox, entity_options: entity_options
            end
            #}}}

          end
        end
      end

      namespace :profile_boxes do 

            #{{{ recommand
            desc "get a box recommandation for the given user"
            params do 
              optional :nmax, type: Integer, desc: "max number of results. default-10", default: 10
            end
            post :recommand do 
              check_confirmed_student!
              reco = current_user.profile_box_recommandation(params[:nmax])
              reco.group_by(&:name).each do |k,v|
                present k.to_sym,v, with: Shapter::Entities::ProfileBox, entity_options: entity_options
              end
            end
            #}}}

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

        namespace ':profile_box_id' do 
          before do 
            params do 
              requires :profile_box_id, desc: "id of the profile box"
            end
            @pb = ProfileBox.find(params[:profile_box_id])
          end

          #{{{ update
          desc "update a profile box"
          params do 
            optional :name
            optional :start_date, type: Date,desc: "starting date"
            optional :end_date, type: Date, desc: "end date"
            optional :item_ids, type: Array, desc: "item_ids"
          end
          put do 
            check_confirmed_account!
            error!("forbidden",403) unless @pb.user unless @pb.user == current_user or current_user.shapter_admin
            clean_p = permit_params(params, [:name, :start_date,  :end_date, :item_ids])
            if @pb.update_attributes(clean_p)
              present @pb, with: Shapter::Entities::ProfileBox, entity_options: entity_options
            else
              error!(@p.errors.messages)
            end
          end
          #}}}

          #{{{ delete
          desc "delete a profile box"
          delete do 
            check_confirmed_account!
            error!("forbidden",403) unless @pb.user unless @pb.user == current_user or current_user.shapter_admin

            @pb.destroy
            present :status, :destroyed
          end
          #}}}

        end

      end
    end
  end
end
