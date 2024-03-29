module Shapter
  module V7
    class EntityAttributes < Grape::API

      format :json

      before do 
        check_user_admin!
      end

      namespace :entity_attributes do 

        desc "get a hash of possible options", { :notes => <<-NOTE
        To use an option, use the `entities` key, e.g.
        
        `entities[user][firstname]=true` #=> please show firstname for users

        Note that the api doesn't really care about the passed value as long as the key is declared. Passing `entities[user][firstname]=0` will also trigger the option
        NOTE
        }
        get do 
          present :comment, [:content, :author, :item, :current_user_likes, :likers_count, :dislikers_count, :created_at, :updated_at, :item_name, :is_alien, :alien_schools, :context].sort
          present :course_builder, [:cart_items, :subscribed_items, :constructor_items].sort
          present :diagram, [:front_values, :author, :item].sort
          present :item, [:name, :syllabus, :tags, :comments_count, :documents_count, :interested_users, :subscribers, :constructor_users, :current_user_subscribed, :current_user_has_in_cart, :current_user_has_in_constructor, :subscribers, :current_user_comments_count, :current_user_diagram, :this_user_has_diagram , :this_user_has_comment, :diagrams_count, :current_user_can_comment, :comments, :requires_comment_score, :shared_docs, :follower_friends, :averaged_diagram, :current_user_has_diagram, :current_user_reco_score, :this_user_reco_score ].sort
          present :shared_doc, [:name, :description, :file, :dlCount, :author].sort
          present :signup_permission, [:email, :school_names, :firstname, :lastname].sort
          present :tag, [:name, :short_name, :items, :category, :students_count, :items_count, :diagrams_count, :comments_count].sort
          present :user, [:image,:email, :firstname, :lastname, :schools, :admin, :confirmed, :confirmed_student, :comments, :comments_likes_count, :comments_dislikes_count, :user_diagram, :sign_in_count, :provider, :is_fb_friend, :comments_count, :items_count, :diagrams_count, :skills].sort
          present :formation_page, [:best_comments, :best_comments_count, :students_count, :comments_count, :diagrams_count, :image_url, :logo_url, :name, :website_url, :description, :sub_formations, :sub_departments, :sub_choices, :image_credits].sort
          present :internship, [:title, :trainee, :start_date, :end_date, :duration, :tags, :address, :lat, :lng, :description, :in_progress].sort
          present :profile_box, [:name, :type, :start_date, :end_date, :tags, :internship, :items].sort
        end

      end
    end
  end
end
