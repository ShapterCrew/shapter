module Shapter
  module V7
    class Reports < Grape::API
      format :json

      before do 
        check_confirmed_account!
      end

      namespace :items do 
        namespace ':item_id' do 
          before do 
            params do 
              requires :item_id, desc: "id of the item"
            end
            @item = Item.find(params[:item_id]) || error!("item not found",404)
          end
          namespace :comments do 
            namespace ':comment_id' do 
              before do 
                params do 
                  requires :comment_id, desc: "id of the comment"
                end
                @comment = @item.comments.find(params[:comment_id]) || error!("comment not found",404)
              end

              #{{{ report comment
              desc 'report a comment'
              params do
                requires :description, desc: "the reason why the comment is reported"
              end
              post :report do 
                r = CommentReport.new(
                  description: params[:description],
                  reporter: current_user,
                  item_id: params[:item_id],
                  comment_id: params[:comment_id],
                )

                if r.save
                  present :status, :reported
                else
                  error!(r.errors)
                end
              end
              #}}}

            end
          end
        end

      end
    end
  end

end
