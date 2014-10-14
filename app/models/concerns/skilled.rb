module Skilled
  extend ActiveSupport::Concern

  def skills
    Rails.cache.fetch("UsrSklls|#{id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 

      # Bon petit map-reduce à l'ancienne :]
      map_items = items.flat_map{|i| i.skills.map{|s| {id: s.id, internship_consolidated: false, name: s.name}}} 
      map_internships = internships.flat_map{|i| i.skills.map{|s| {id: s.id, internship_consolidated: true, name: s.name}}} 

      reduced = (map_items + map_internships).reduce(Hash.new) do |res, h|
        res[h[:id]] ||= {power: 0, internship_consolidated: false}
        res[h[:id]][:tag_id] ||= h[:id]
        res[h[:id]][:name] ||= h[:name]
        res[h[:id]][:power] += 1
        res[h[:id]][:internship_consolidated] = true if h[:internship_consolidated]
        res
      end

      reduced.values
    end

  end

end
