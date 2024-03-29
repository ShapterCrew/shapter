module Shapter
  module V7
    class SharedDocs < Grape::API
      format :json

      before do 
        #check_confirmed_student!
        #check_confirmed_account!
      end

      namespace :items do 
        namespace ':item_id' do 

          before do 
            params do 
              requires :item_id, type: String, desc: "id of the item"
            end
            @item = Item.find(params[:item_id]) || error!("item not found",404)
          end

          namespace :sharedDocs do 

            #{{{ index
            desc "get a list of docs for this item"
            post do 
              present :shared_docs, @item.shared_docs, with: Shapter::Entities::SharedDoc, entity_options: entity_options
            end
            #}}}

            #{{{ create
            desc "create a doc for this item"
            params do 
              requires :sharedDoc, type: Hash do
                requires :name, type: String, desc: "name of the document"
                optional :description, type: String, desc: "description"
                requires :file, desc: "file"
                requires :filename, desc: "filename, with the extension"
              end
            end
            post :create do
              check_confirmed_student!
              error!("forbidden",403) unless @item.user_can_comment?(current_user)
              s = params[:sharedDoc][:file].split(',').last
              tempfile = Tempfile.new('upload')
              tempfile.binmode
              tempfile.write(Base64.decode64(s))

              uploaded_file = ActionDispatch::Http::UploadedFile.new(:tempfile => tempfile, :filename => params[:sharedDoc][:filename], :original_filename => params[:sharedDoc][:filename])

              clean_p = {
                :name => params[:sharedDoc][:name],
                :description => params[:sharedDoc][:description],
                :file => uploaded_file,
                :item => @item,
                :author => current_user,
              }

              doc = SharedDoc.new(clean_p)
              please_track = doc.new_record?

              if doc.save
                present doc, with: Shapter::Entities::SharedDoc, entity_options: entity_options
                Behave.delay.track(current_user.pretty_id, "upload document") if please_track
              else
                error!(doc.errors.messages)
              end
            end
            #}}}

            namespace ':doc_id' do 
              before do 
                params do 
                  requires :doc_id, type: String, desc: "id of the document"
                end
                @shared_doc = @item.shared_docs.find(params[:doc_id]) || error!("doc not found",404)
              end

              #{{{ get
              desc "get the shared_doc"
              post do 
                present @shared_doc, with: Shapter::Entities::SharedDoc, entity_options: entity_options
              end
              #}}}

              #{{{ update
              desc "update document attributes"
              params do
                optional :name, type: String, desc: "name of the document"
                optional :description, type: String, desc: "description"
                optional :file, desc: "file"
              end
              put do 
                check_confirmed_student!
                error!("forbidden",403) unless @shared_doc.author == current_user or current_user.shapter_admin?

                clean_p = [
                  (name = params[:sharedDoc][:name]) ? {name: name} : {},
                  (description = params[:sharedDoc][:description]) ? {description: description} : {},
                  (file = params[:sharedDoc][:file]) ? {file: file} : {},
                ].reduce(&:merge)

                if @shared_doc.update_attributes(clean_p)
                  present @sharedDoc, with: Shapter::Entities::SharedDoc, entity_options: entity_options
                else
                  error!(@shared_doc.errors.messages)
                end
              end
              #}}}

              #{{{ delete
              desc "delete document"
              delete do 
                check_confirmed_student!
                error!("forbidden",403) unless @shared_doc.author == current_user or current_user.shapter_admin?
                @shared_doc.destroy
                @item.save
                present :status, :deleted
              end
              #}}}

              #{{{ score
              desc "like, or dislike a document"
              params do 
                requires :score, type: Integer, desc: "score"
              end
              put :score do 
                check_confirmed_student!
                error!("forbidden",403) unless @item.user_can_comment?(current_user)
                s = params[:score].to_i

                old_score = if @shared_doc.likers.include?(current_user)
                              1
                            elsif @shared_doc.dislikers.include?(current_user)
                              -1
                            else
                              0
                            end

                if s == 0
                  action = "unlike document"
                  @shared_doc.likers.delete(current_user)
                  @shared_doc.dislikers.delete(current_user)
                elsif s == 1
                  action = "like document"
                  @shared_doc.likers << current_user
                  @shared_doc.dislikers.delete(current_user)
                elsif s == -1
                  action = "dislike document"
                  @shared_doc.dislikers << current_user
                  @shared_doc.likers.delete(current_user)
                else
                  error!("invalid score parameter")
                end

                if @shared_doc.save
                  present @shared_doc, with: Shapter::Entities::SharedDoc, entity_options: entity_options
                  if s != old_score
                    Behave.delay.track current_user.pretty_id, action, last_state: old_score, document_author: @shared_doc.author.pretty_id, shared_doc: @shared_doc.pretty_id 
                    Behave.delay.track @shared_doc.author.pretty_id, "receive document like" if s == 1
                  end
                else
                  error!(comment.errors.messages)
                end
              end
              #}}}

              #{{{ countDl
              desc "add +1 to download counter"
              post :countDl do
                @shared_doc.inc(dl_count: 1) 
                present :count, @shared_doc.dl_count
              end
              #}}}

            end
          end
        end
      end

    end
  end
end
