module Shapter
  module Helpers
    module OptionsHelper

      # This doesn't directly merge params[:entities], it creates a white list of acceptable attributes instead
      def entity_options
        empty_h = {
          "comment"           => (params[:entities]["comment"]           rescue nil )|| {},
          "course_builder"    => (params[:entities]["course_builder"]    rescue nil )|| {},
          "diagram"           => (params[:entities]["diagram"]           rescue nil )|| {},
          "item"              => (params[:entities]["item"]              rescue nil )|| {},
          "shared_doc"        => (params[:entities]["shared_doc"]        rescue nil )|| {},
          "signup_permission" => (params[:entities]["signup_permission"] rescue nil )|| {},
          "tag"               => (params[:entities]["tag"]               rescue nil )|| {},
          "user"              => (params[:entities]["user"]              rescue nil )|| {},
          "formation_page"    => (params[:entities]["formation_page"]    rescue nil )|| {},
          "internship"        => (params[:entities]["internship"]        rescue nil )|| {},
        }

        empty_h.merge({:current_user => current_user || User.new})
      end

      def permit_params(h,ary)
        ary.map { |attr|
          h[attr] ? {attr => h[attr]} : {}
        }.reduce({}, &:merge)
      end

    end
  end
end
