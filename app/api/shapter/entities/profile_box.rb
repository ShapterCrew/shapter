module Shapter
  module Entities
    class ProfileBox < Grape::Entity
      expose :pretty_id, as: :id

      expose :name      , if: lambda{|pb,o| o[:entity_options]["profile_box"][:name]}
      expose :type      , if: lambda{|pb,o| o[:entity_options]["profile_box"][:type]}
      expose :start_date, if: lambda{|pb,o| o[:entity_options]["profile_box"][:start_date]}
      expose :end_date  , if: lambda{|pb,o| o[:entity_options]["profile_box"][:end_date]}

      expose :tags, using: Shapter::Entities::Tag, if: lambda{|pb,o| o[:entity_options]["profile_box"][:tags]}

      expose :internship, using: Shapter::Entities::Internship, if: lambda{|pb,o| pb.type == "internship" and o[:entity_options]["profile_box"][:internships]}
      expose :items, using: Shapter::Entities::Item, if: lambda{|pb,o| pb.type == "items" and o[:entity_options]["profile_box"][:items]}
    end
  end
end
