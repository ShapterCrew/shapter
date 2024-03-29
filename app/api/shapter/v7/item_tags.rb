module Shapter
  module V7
    class ItemTags < Grape::API
      helpers Shapter::Helpers::FilterHelper
      format :json

      before do 
        check_user_admin!
      end

      namespace "items" do 
        namespace "tags" do 

          #{{{ add tags to a list of items
          desc "add a list of tags to a list of items"
          params do 
            requires :item_ids, type: Array, desc: "list of items ids"
            requires :tags, type: Array do 
              requires :tag_name, type: String, desc: "name of the tag"
              requires :category, type: String, desc: "category of the tag"
            end
          end
          post :add do 
            items = Item.any_in(id: params[:item_ids]) || error!("no item found",418)
            tags = params[:tags].map do |h|
              Tag.find_or_create_by(name: h[:tag_name], category: h[:category])
            end

            items.each do |item|
              tags.each do |tag|
                # not sure it's necessary to use both commands, but I'm starting to feel a bit paranoid with mongoid callbacks...
                item.add_to_set(tag_ids: tag.id)
                tag.add_to_set(item_ids: item.id)
              end
            end

            items.each(&:touch)
            tags.each(&:touch)

            present :items, items, with: Shapter::Entities::Item, entity_options: entity_options
            present :tags, tags, with: Shapter::Entities::Tag, entity_options: entity_options
            present :status, :added

          end
          #}}}

          #{{{ remove tags
          desc "removes a list of tags from a list of items"
          params do 
            requires :item_ids, type: Array, desc: "list of items ids"
            requires :tags, type: Array do 
              requires :tag_name, type: String, desc: "name of the tag"
              requires :category, type: String, desc: "category of the tag"
            end
          end
          post :delete do 
            items = Item.any_in(id: params[:item_ids]) || error!("no item found",418)
            tags = params[:tags].map do |h|
              Tag.find_or_create_by(name: h[:tag_name], category: h[:category])
            end

            status = :nothing_changed

            items.each do |item|
              tags.each do |tag|
                # not sure it's necessary to use both commands, but I'm starting to feel a bit paranoid with mongoid callbacks...
                if item.tag_ids.include? tag.id or tag.item_ids.include? item.id
                  item.update_attribute(:tag_ids, item.tag_ids - [tag.id])
                  tag.update_attribute(:item_ids, tag.item_ids - [item.id])
                  status = :deleted
                end
              end
            end

            present :items, items, with: Shapter::Entities::Item, entity_options: entity_options
            present :tags, tags, with: Shapter::Entities::Tag, entity_options: entity_options
            present :status, status

          end
          #}}}

        end
      end

    end
  end
end
