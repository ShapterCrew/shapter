module Shapter
  module V7
    class Users < Grape::API
      helpers Shapter::Helpers::UsersHelper
      helpers Shapter::Helpers::ContributeHelper
      format :json


      namespace :users do 

        #{{{ schools_for
        desc "ask which schools are to be associated to an email address"
        params do
          requires :email, type: String, desc: "email to test"
        end
        post :schools_for do 
          present :schools, User::schools_for(params[:email]), with: Shapter::Entities::Tag, entity_options: entity_options
        end
        #}}}

        namespace :me do 
          #before do 
          #  check_user_login!
          #end

          #{{{ /users/me
          post do 
            check_user_login!
            present current_user, with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ comment pipe
          desc "comment pipe : what are the items to comment ?"
          params do 
            optional :n, type: Integer, default: 5, desc: "number of items to get"
            optional :n_start, type: Integer, default: 0, desc: "starting index. default = 0 to get the first item"
            optional :school_id, type: String, desc: "if school_id is passed, then only items from this school will be presented"
          end
          post "comment-pipe" do 
            check_confirmed_student!
            n        = params[:n]       || 5
            n_start  = params[:n_start] || 0

            school = if params[:school_id]
                       Tag.schools.find(params[:school_id]) || error!("school not found",404)
                     else
                       nil
                     end

            commentable = commentable_items(current_user,school,n_start,n)
            diagramable = diagramable_items(current_user,school,n_start,n)
            skillable   =   skillable_items(current_user,school,n_start,n)

            present :commentable_items, commentable , with: Shapter::Entities::Item, entity_options: entity_options
            present :diagram_items, diagramable , with: Shapter::Entities::Item, entity_options: entity_options
            present :skill_items, skillable , with: Shapter::Entities::Item, entity_options: entity_options
          end
          #}}}

          #{{{ friends
          desc "get my friends from facebook x shapter"
          post :friends do 
            check_confirmed_account!
            present :friends, current_user.friends, with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ alike
          desc "get a list of users that ressemble you"
          post :alike do 
            check_confirmed_student!
            present :alike_users, alike_users(current_user), with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ social
          desc "get a list of both users that ressemble you, and friends"
          post :social do 
            check_confirmed_student!
            present :alike_users, alike_users(current_user), with: Shapter::Entities::User, entity_options: entity_options
            present :friends, current_user.friends, with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ leaderboard
          desc  "get a leaderboard from behave.io, that intersects the user's schools"
          params do 
            optional :max, type: Integer, default: 10, desc: "max number of elements. default 10"
          end
          post :leaderboard do 
            check_confirmed_student!
            a = Behave::Leaderboard.results("points").reject do |h|
              s1 =  (h[:player][:traits][:schools] rescue [] ) || []
              s2 = current_user.schools.map(&:name)
              (s1 & s2).empty?
            end
            present :leaderboard, a.take(params[:max] || 10)
          end
          #}}}

          #{{{ latest_comments
          desc "returns a list of latest comments in my subscribed items, my cart items, my constructor items"
          params do 
            optional :hide_my_items         , type: Boolean, desc: "do not present user's items comments"           , default: false
            optional :hide_cart_items       , type: Boolean, desc: "do not present cart items comments"             , default: false
            optional :hide_constructor_items, type: Boolean, desc: "do not present constructor items comments"      , default: false

            optional :my_max                , type: Integer, desc: "maximum items in my list. default = 10"         , default: 10
            optional :cart_max              , type: Integer, desc: "maximum items in cart list. default = 10"       , default: 10
            optional :constructor_max       , type: Integer, desc: "maximum items in constructor list. default = 10", default: 10
          end
          post :latest_comments do
            check_confirmed_student!

            unless params[:hide_my_items]
              my_items             = current_user.items            .not.where(comments: nil).flat_map(&:comments).sort_by{|c| c.updated_at}.reverse.take(params[:my_max])
              present(:my_item_comments         , my_items, with: Shapter::Entities::Comment, entity_options: entity_options) 
            end
            unless params[:hide_cart_items]
              my_cart_items        = current_user.cart_items       .not.where(comments: nil).flat_map(&:comments).sort_by{|c| c.updated_at}.reverse.take(params[:cart_max])
              present(:cart_item_comments       , my_cart_items, with: Shapter::Entities::Comment, entity_options: entity_options) 
            end
            unless params[:constructor_items]
              my_constructor_items = current_user.constructor_items.not.where(comments: nil).flat_map(&:comments).sort_by{|c| c.updated_at}.reverse.take(params[:constructor_max])
              present(:constructor_item_comments, my_constructor_items, with: Shapter::Entities::Comment, entity_options: entity_options) 
            end
          end
          #}}}

        end

        resource ":user_id" do 
          before do 
            params do 
              requires :user_id, type: String, desc: "id of the user"
            end
            @user = User.find(params[:user_id]) || error!("not found",404)
          end

          #{{{ alike
          desc "get a list of users that ressemble the user"
          post :alike do 
            present :alike_users, alike_users(@user), with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ get user
          post do 
            present @user, with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

          #{{{ friends
          desc "get user's friends from facebook x shapter"
          post :friends do 
            check_confirmed_account!
            present @user.friends, with: Shapter::Entities::User, entity_options: entity_options
          end
          #}}}

            #{{{ courses 
            desc "for each constructor_funnel step, get the list of items that intersect constructor_funnel & current_user cart/items/constructor_items"
            params do 
              requires :schoolTagId, type: String, desc: "id of the tag that represent the user's school"
              optional :displayCart, type: Boolean, desc: "choose wether the cart items should be displayed", default: false
              optional :displayConstructor, type: Boolean, desc: "choose wether the constructor items should be displayed", default: false
            end
            post :courses do 
              school = Tag.schools.find(params[:schoolTagId]) || error!("tag not found",404)
              error!("forbidden" ,401) unless @user.schools.include? school

              error!("school #{school.name} has no constructor funnel") if school.constructor_funnel.blank?

              cart = @user.cart_item_ids
              builder = school.constructor_funnel.map do |h|
                OpenStruct.new({
                  name: h["name"],
                  subscribed_items: @user.items.all_in(tag_ids: h["tag_ids"]),
                }
                .merge( !!params[:displayCart] ? {cart_items: @user.cart_items.all_in(tag_ids: h["tag_ids"])} : {} )
                .merge( !!params[:displayConstructor] ? {constructor_items: @user.constructor_items.all_in(tag_ids: h["tag_ids"])} : {})
                      )

              end

              present builder, with: Shapter::Entities::CourseBuilder, entity_options: entity_options, this_user: @user

            end
            #}}}

        end
      end

    end
  end
end
