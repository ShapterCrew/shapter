module Shapter
  module Entities
    class Tag < Grape::Entity
      expose :pretty_id, as: :id
      expose :name      , if: lambda{ |u,o| o[:entity_options]["tag"][:name]}
      expose :short_name, if: lambda{ |u,o| o[:entity_options]["tag"][:short_name]}
      expose :items     , using: Shapter::Entities::Item, if: lambda{ |u,o| o[:entity_options]["tag"][:items]}
      expose :internships, using: Shapter::Entities::Internship, if: lambda{ |u,o| o[:entity_options]["tag"][:internships]}
      expose :category, as: :category  , if: lambda{ |u,o| o[:entity_options]["tag"][:category]} 

      expose :students_count, if: lambda{ |u, o| o[:entity_options]["tag"][:students_count]}
      expose :items_count   , if: lambda{ |u, o| o[:entity_options]["tag"][:items_count]}
      expose :diagrams_count, if: lambda{ |u, o| o[:entity_options]["tag"][:diagrams_count]}
      expose :comments_count, if: lambda{ |u, o| o[:entity_options]["tag"][:comments_count]}
    end
  end
end
