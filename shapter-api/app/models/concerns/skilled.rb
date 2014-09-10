module Skilled
  extend ActiveSupport::Concern

  included do 

    def skills
      Rails.cache.fetch("UsrSklls|#{id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
        items.flat_map(&:skills).group_by{|t| t}.map{|a| [a.first,a.last.size] }.map do |tag,count|
          {
            tag_id: tag.id,
            name: tag.name,
            power: count,
            #internship_consolidated: #to do when internships are available
          }
        end
      end
    end

    #def suggested_skills
    #end

  end

end
