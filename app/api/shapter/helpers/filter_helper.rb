module Shapter
  module Helpers
    module FilterHelper


      #{{{ filter_items
      # This for v2. 
      def filter_items2(ary)
        Rails.cache.fetch( "filterItem|#{ary.sort.join(":")}|#{cache_key_for(Tag,Item)}", expires_in: 90.minutes ) do 
          compute_filter(ary).sort_by(&natural_sort)
        end
      end

      def quality_filter(ary)
        Rails.cache.fetch( "qualityFilter|#{ary.sort.join(":")}|#{cache_key_for(Tag,Item)}", expires_in: 90.minutes ) do 
          compute_filter(ary).sort_by(&quality_sort).reverse
        end
      end

      def compute_filter(ary)
        return [] if ary.empty?
        Item.all_in("tag_ids" => ary)
      end
      #}}}

      #{{{ filter_internships
      def filter_internships(ary,active_only=false)
        Rails.cache.fetch( "filterIntrnshp|#{active_only}|#{ary.sort.join(":")}|#{cache_key_for(Tag,Internship)}", expires_in: 90.minutes ) do 
          compute_internship_filter(ary,active_only).sort_by(&natural_sort)
        end
      end

      def compute_internship_filter(ary,active_only)
        all = Internship.all_in("tag_ids" => ary)
        if active_only
          all.gte(end_date: Date.today).lte(start_date: Date.today)
        else
          all
        end
      end
      #}}}

      ##{{{ reco_tags

      # To perform a collaborative filtering based on tag->item->tag path, klass=Item.
      def reco_tags(ary,category,klass)
        Rails.cache.fetch( "RecoTags|#{category}|#{klass}|#{ary.sort.join(":")}|#{cache_key_for(Tag,klass)}", expires_in: 90.minutes ) do 
          tags_for_klass_ids(
            (klass_instances_ids =  klass.all_in("tag_ids" => ary ).only(:id)).map(&:id), klass, category, ary
        ).asc(:autocomplete)
        end
      end

      ##}}}

      private

      #{{{ private

      def tags_for_klass_ids(ary_of_klass_ids,klass,category,initial_ary)
        ts = Tag.any_in("#{klass.to_s.downcase}_ids" => ary_of_klass_ids)
        res = if category
                ts.where(category: category)
              else
                ts
              end
        res
      end

      def cache_key_for(*args)
        args.sort_by(&:to_s).map { |klass|
          [
            #klass.to_s,
            klass.max(:updated_at).try(:utc).try(:to_s, :number)
          ].join(":")
        }
        .join("|")
      end

      def natural_sort
        Proc.new do |item|
          item.name
          .downcase
          .gsub(/[à|À|á|Á|ã|Ã|â|Â|ä|Ä]/,"a")
          .gsub(/[é|É|è|È|ê|Ê|ẽ|Ẽ|ë|Ë]/,'e')
        end
      end

      def quality_sort
        Proc.new do |item|
          item.avg_diag.values[6].to_i
        end
      end
      #}}}

    end
  end
end
