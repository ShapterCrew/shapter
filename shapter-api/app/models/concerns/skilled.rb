module Skilled
  extend ActiveSupport::Concern

  included do 

    def skills
      items.flat_map(&:skills).group_by{|t| t}.map{|a| [a.first,a.last.size] }.map do |tag,count|
        {
          tag_id: tag.id,
          name: tag.name,
          power: count,
          #internship_consolidated: #to do when internships are available
        }
      end
    end

    #def suggested_skills
    #end

  end

end
