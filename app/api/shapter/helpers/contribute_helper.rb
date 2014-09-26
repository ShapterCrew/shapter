module Shapter
  module Helpers
    module ContributeHelper

      #{{{ items that needs comments
      def commentable_items(current_user,school,n_start,n)
        if school

          r = current_user.items
          .where("tag_ids" => school.id)
          .desc(:requires_comment_score)
          .not.where("comments.author_id" => current_user.id)
          .skip(n_start)
          .take(n)
        else
          r = current_user.items
          .desc(:requires_comment_score)
          .not.where("comments.author_id" => current_user.id)
          .skip(n_start)
          .take(n)
        end
      end
      #}}}

      #{{{ items that needs diagrams
      def diagramable_items(current_user,school,n_start,n)
        if school
          r = current_user.items
          .where("tag_ids" => school.id)
          .desc(:requires_diagram_score)
          .not.where("diagrams.author_id" => current_user.id)
          .skip(n_start)
          .take(n)
        else
          r = current_user.items
          .not.where("diagrams.author_id" => current_user.id)
          .desc(:requires_diagram_score)
          .skip(n_start)
          .take(n)
        end
      end
      #}}}

      #{{{ items that needs skills
      def skillable_items(current_user,school,n_start,n)
        if school

          r = current_user.items
          .where("tag_ids" => school.id)
          .desc(:requires_skill_score)
          .skip(n_start)
          .take(n)
        else
          r = current_user.items
          .desc(:requires_skill_score)
          .skip(n_start)
          .take(n)
        end
      end
      #}}}

    end
  end
end
