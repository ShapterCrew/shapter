module Shapter
  module V7
    class Internships < Grape::API
      format :json

      before do 
        check_user_login!
      end

      namespace :internships do 

        #{{{ create
        desc "create an internship"
        params do 
          requires :title, desc: "internship title"
          requires :start_date, type: Date, desc: "starting date"
          requires :end_date, type: Date, desc: "ending date"
          optional :tags_by_ids, type: Array, desc: "directly pass the ids of known tags to associate"
          optional :tags_by_name_cat, type: Array, desc: "find or create tags by name/category" do 
            requires :tag_name, desc: "name of the tag"
            requires :tag_category, desc: "tag category"
          end
        end
        post :create do 
          check_confirmed_student!

          new_tags =  params[:tags_by_name_cat].map{ |h|
            if Internship.acceptable_categories.include?(h["tag_category"])
              Tag.find_or_create_by(name: h["tag_name"], category: h["tag_category"])
            else
              nil
            end
          }.compact

          old_tags = Tag.find(params[:tags_by_ids]).compact

          tags = (new_tags + old_tags).uniq

          i = Internship.new(
            trainee_id: current_user.id,
            title: params[:title],
            start_date: params[:start_date],
            end_date: params[:end_date],
            tags: tags
          )

          if i.save
            present i, with: Shapter::Entities::Internship, entity_options: entity_options
          else
            error!(i.errors.messages)
          end
        end
        #}}}

        namespace ':internship_id' do
          before do 
            params do 
              requires :internship_id, desc: 'id of the internship to fetch'
            end
            @internship = Internship.find(params[:internship_id])
          end

          #{{{ get
          desc "get an internship from its id"
          post do 
            present @internship, with: Shapter::Entities::Internship, entity_options: entity_options
          end
          #}}}

        end

      end
    end
  end
end
