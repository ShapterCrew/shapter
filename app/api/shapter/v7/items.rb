module Shapter
  module V7
    class Items < Grape::API
      helpers Shapter::Helpers::FilterHelper
      helpers Shapter::Helpers::UsersHelper
      format :json

      before do 
        #check_confirmed_student!
        #check_confirmed_account!
      end

      namespace :items do 

        #{{{ tag filter
        desc "search for an item using a list of tags"
        params do 
          requires :filter, type: Array, desc: "array of tags to filter with"
          optional :n_start, type: Integer, desc: "index to start with. default: 0", default: 0
          optional :n_stop, type: Integer, desc: "index to end with. default: 14. -1 will return the entire list", default: 14

          optional :quality_filter, type: Boolean, desc: "passing any value will result in a filtering by quality of avg_diags instead of name"
          optional :cart_only, type: Boolean, desc: "look only for items that are in my favorites"
        end
        post :filter do 
          nstart = params[:n_start].to_i
          nstop  = params[:n_stop].to_i

          f = if !!params[:quality_filter]
                quality_filter(params[:filter])
              else
                filter_items2(params[:filter])
              end

          results = if !!params[:cart_only]
                      check_confirmed_account! # logged users only can have a cart
                      (f & current_user.cart_items)
                    else
                      f
                    end

          present :number_of_results, results.size
          present :items, results[nstart..nstop], with: Shapter::Entities::Item, entity_options: entity_options
        end
        #}}}

        #{{{ create with tags
        desc "create multiple items, all of them being tagged with some tags (using tag names)"
        params do 
          requires :item_names, type: Array, desc: "name of the items to create"
          requires :tags, type: Array do 
            requires :tag_name, type: String, desc: "name of the tag"
            requires :category, type: String, desc: "category code of the tag"
          end
        end
        post :create_with_tags do 
          check_user_admin!

          tags = params[:tags].map do |tag|
            Tag.find_or_create_by(name: tag["tag_name"], category: tag["category"])
          end

          items = params[:item_names].map do |item_name|
            Item.create(name: item_name)
          end

          items.each do |item|
            special_tag = Tag.find_or_create_by(name: item.name, category: "item_name")
            (tags + [special_tag]).each do |tag|
              item.add_to_set(tag_ids: tag.id)
              tag.add_to_set(item_ids: item.id)
            end
          end

          items.each(&:touch)
          tags.each(&:touch)

          present :status, :created
          present :tags, tags, with: Shapter::Entities::Tag, entity_options: entity_options
          present :items, items, with: Shapter::Entities::Item, entity_options: entity_options

        end
        #}}}

        namespace ':id' do 
          before do 
            params do 
              requires :id, type: String, desc: "id of the item to fetch"
            end
            @item = Item.find(params[:id]) || error!("item not found",404)
          end

          #{{{ get
          desc "get item infos"
          post do 
            present @item, with: Shapter::Entities::Item, entity_options: entity_options
          end
          #}}}

          #{{{ subscribe
          desc "subscribe to the item"
          post :subscribe do 
            check_confirmed_student!
            error!("user is no verified student of this school",401) unless @item.user_can_comment?(current_user)
            do_not_track = ( current_user.items.include?(@item))
            @item.subscribers << current_user
            if @item.save
              present @item, with: Shapter::Entities::Item, entity_options: entity_options
              Behave.delay.track(current_user.pretty_id, "subscribe item", item: @item.pretty_id ) unless do_not_track
              current_user.touch unless do_not_track
              current_user.touch unless do_not_track
            else
              error!(@item.errors.messages)
            end
          end
          #}}}

          #{{{ unsubscribe
          desc "unsubscribe to the item"
          post :unsubscribe do 
            check_confirmed_student!
            error!("user is no verified student of this school",401) unless @item.user_can_comment?(current_user)
            do_not_track = !(current_user.items.include?(@item))
            @item.subscribers.delete(current_user)
            if @item.save
              present @item, with: Shapter::Entities::Item, entity_options: entity_options
              Behave.delay.track(current_user.pretty_id, "unsubscribe item", item: @item.pretty_id ) unless do_not_track
              current_user.touch unless do_not_track
            else
              error!(@item.errors.messages)
            end
          end
          #}}}

          #{{{ cart
          desc "add item to cart"
          post :cart do 
            check_confirmed_account!
            error!("user is no verified student of this school",401) unless @item.user_can_comment?(current_user)
            do_not_track = (current_user.cart_items.include?(@item))
            @item.interested_users << current_user
            if @item.save
              present @item, with: Shapter::Entities::Item, entity_options: entity_options
              Behave.delay.track(current_user.pretty_id, "add to cart", item: @item.pretty_id ) unless do_not_track
            else
              error!(@item.errors.messages)
            end
          end
          #}}}

          #{{{ uncart
          desc "removes the item from cart"
          post :uncart do 
            check_confirmed_account!
            error!("user is no verified student of this school",401) unless @item.user_can_comment?(current_user)
            do_not_track = !(current_user.cart_items.include?(@item))
            @item.interested_users.delete(current_user)
            if @item.save
              present @item, with: Shapter::Entities::Item, entity_options: entity_options
              Behave.delay.track(current_user.pretty_id, "remove from cart", item: @item.pretty_id ) unless do_not_track
            else
              error!(@item.errors.messages)
            end
          end
          #}}}

          #{{{ destroy
          desc "destroy an item"
          delete do 
            check_user_admin!
            error!("forbidden",403) unless current_user.shapter_admin

            @item.destroy

            {
              item_id: @item.id.to_s,
              status: :destroyed
            }.to_json

          end
          #}}}

          #{{{ update
          desc "update an item" 
          params do 
            requires :item, type: Hash do 
              optional :name, type: String, desc: "item name"
              optional :syllabus, type: String, desc: "syllabus"
              optional :short_name, type: String, desc: "short name"
            end
          end
          put :update do 
            check_user_admin!
            error!("forbidden",403) unless current_user.shapter_admin

            ok_params = [
              !!(x = params[:item][:name])        ? {name: x}        : {},
              !!(x = params[:item][:syllabus])    ? {syllabus: x}    : {},
              ( !!(x = params[:item][:syllabus]) and x != @item.syllabus )   ? {syllabus_author: current_user}    : {},
              !!(x = params[:item][:short_name])  ? {short_name: x}  : {},
            ].reduce(&:merge)

            @item.update_attributes(ok_params)

            present @item, with: Shapter::Entities::Item, entity_options: entity_options
          end
          #}}}

          #{{{ update_syllabus
          desc "update an item syllabus. This can be done with update, but has less restrictions" 
          params do 
            requires :syllabus, type: String, desc: "syllabus"
          end
          put :update_syllabus do 
            check_confirmed_student!
            error!("forbidden",403) unless ( (current_user.schools & @item.tags.schools).any? or current_user.shapter_admin)

            @item.update_attribute(:syllabus, params[:syllabus])

            present @item, with: Shapter::Entities::Item, entity_options: entity_options
          end
          #}}}

          #{{{ avg_diag
          desc "get the averaged diagram of the item" 
          post :avgDiag do
            present @item.front_avg_diag
          end
          #}}}

          #{{{ reco_score
          desc "user scores an item to recommend the item", {:notes => <<-NOTE
                                                              - score = 0 => delete score
                                                              - score = 1 => unrecommand item (do not recommend)
                                                              - score = 2 => norecommand item (could recommend, it depends)
                                                              - score = 3 => unrecommand item (does recommend)
                                                              - score = anything_else => raise exception 
                                                             NOTE
          }
          params do 
            requires :score, type: Integer, desc: "score to put"
          end
          put :reco_score do 
            check_confirmed_student!
            if current_user.reco_score_item!(@item, params[:score])
              present @item, with: Shapter::Entities::Item, entity_options: entity_options
            else
              error!(@item.errors)
            end
          end
          #}}}

        end

      end

    end
  end
end
