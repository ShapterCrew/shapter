require 'ostruct'
module Shapter
  module V7
    class Tags < Grape::API
      format :json

      helpers Shapter::Helpers::FilterHelper

      before do 
        check_confirmed_account!
      end

      namespace :tags do 

        #{{{ typeahead
        desc "enter at least 3 characters and find the tags that match the search string. input parameters work as for the tags/suggested route"
        params do 
          requires :selected_tags, type: Array, desc: "Array of pre-selected tag ids."
          requires :context, type: String, desc: "Please pass 'item' or 'internship' to determine wether you are you looking for internships-related tags, or item-related tags"
          requires :search_string, type: String, desc: "The string to search with"
          optional :limit, type: Integer, desc: "Limit the max number of results (default 100)", default: 100
          optional :category_filter, type: String, desc: "only tags of this category will be selected"
        end
        post :typeahead do 
          error!("please provide at least 3 characters") if params[:search_string].size < 3

          klass = if params[:context] == "item" 
                    Item
                  elsif params[:context] == "internship"
                    Internship
                  else
                    error!("Please pass 'item' or 'internship' to determine wether you are you looking for internships-related tags, or item-related tags") 
                  end

          bucket = if params[:selected_tags].any?
                     reco_tags(params[:selected_tags],params[:category_filter],klass)
                   else
                     if params[:category_filter]
                       Tag.where(category: params[:category_filter])
                     else
                       Tag
                     end
                   end

          res = bucket.where(autocomplete: /#{Autocomplete.normalize(params[:search_string])}/).asc(:name).take(params[:limit])

          present :tags, res, with: Shapter::Entities::Tag, entity_options: entity_options
        end
        #}}}

        # suggested {{{
        desc "suggested tags to filter with", { :notes => <<-NOTE
        Given a list of set tags, and given the user's tags, this route provides an array of relevant tags, associated with their weights.
                                                NOTE
        }
        params do 
          requires :selected_tags, type: Array, desc: "Array of pre-selected tag ids"
          requires :context, type: String, desc: "Please pass 'item' or 'internship' to determine wether you are you looking for internships-related tags, or item-related tags"
          optional :limit, type: Integer, desc: "Limit the max number of results (default 100)", default: 100
          optional :category_filter, type: String, desc: "only tags of this category will be selected"
        end

        post :suggested do 


          klass = if params[:context] == "item" 
                    Item
                  elsif params[:context] == "internship"
                    Internship
                  else
                    error!("Please pass 'item' or 'internship' to determine wether you are you looking for internships-related tags, or item-related tags") 
                  end

                    resp = reco_tags(params[:selected_tags],params[:category_filter],klass)
                    .take(params[:limit] + params[:selected_tags].size)
                    .reject{|t| params[:selected_tags].include? t.id.to_s}
                    .take(params[:limit])

          present :recommended_tags, resp, with: Shapter::Entities::Tag, entity_options: entity_options

        end
        # }}}

                    #{{{ batch_tag
                    desc "add a tag to multiple items at the same time"
                    params do 
                      requires :item_ids_list, type: Array, desc: "list of item ids to tag"
                      requires :tag_name, type: String, desc: "The name of the tag"
                    end
                    post :batch_tag do 

                      error!("forbidden",403) unless current_user.shapter_admin

                      tag = Tag.find_or_create_by(name: params[:tag_name].chomp.strip)
                      Item.any_in(id: params[:item_ids_list]).each do |item|
                        tag.items << item
                      end
                      if tag.save
                        tag.reload
                        present tag, with: Shapter::Entities::Tag, entity_options: entity_options
                      else
                        error!(tag.errors,500)
                      end

                    end
                    #}}}

                    namespace ":tag_id" do 
                      before do 
                        params do 
                          requires :tag_id, type: String, desc: "The tag id"
                        end
                        @tag = Tag.find(params[:tag_id]) || error!("tag not found", 404)
                      end

                      #{{{ best comments
                      desc "get the best comments for the items linked to this tag"
                      params do 
                        optional :n_max, type: Integer, desc: "max number of comments to get"
                      end
                      post :best_comments do 
                        n_max = params[:n_max] || 5
                        present @tag.best_comments(n_max), with: Shapter::Entities::Comment, entity_options: entity_options
                      end
                      #}}}

                      #{{{ students
                      desc "get a list of students from a school"
                      post :students do
                        #tag = Tag.find(params[:tag_id]) || error!("tag not found",404)
                        present :students, @tag.cached_students, with: Shapter::Entities::User, entity_options: entity_options
                      end
                      #}}}

                      #{{{ udpate
                      desc "update tag's attributes"
                      params do 
                        optional :name, type: String, desc: "tag name"
                        optional :short_name, type: String, desc: "short name"
                        #optional :type, type: String, desc: "tag type"
                      end
                      put do 
                        error!("forbidden",403) unless current_user.shapter_admin

                        tag_params = [
                          :name,
                          :short_name,
                          :type,
                          :website_url,
                          :description,
                        ].reduce({}) do |h,p|
                          h.merge( params[p] ? {p => params[p]} : {} )
                        end

                        @tag.update(tag_params)
                      end
                      #}}}end

                      #{{{ show
                      desc "show tag"
                      post  do 
                        present @tag, with: Shapter::Entities::Tag, entity_options: entity_options
                      end
                      #}}}

                      #{{{ destroy
                      desc "delete tag"
                      delete "" do 
                        error!("forbidden",403) unless current_user.shapter_admin
                        @tag.destroy
                        {:id => @tag.id.to_s, :status => :destroyed}.to_json
                      end
                    end
                    #}}}

        end
      end

    end
  end
