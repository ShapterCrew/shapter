module Shapter
  module Entities
    class Internship < Grape::Entity
      expose :pretty_id                 , as: :id
      expose :title, if: lambda {|i,o| o[:entity_options]["internship"][:title] }
      expose :trainee, using: Shapter::Entities::User, if: lambda {|i,o| o[:entity_options]["internship"][:trainee] }
      expose :start_date, if: lambda {|i,o| o[:entity_options]["internship"][:start_date] }
      expose :end_date, if: lambda {|i,o| o[:entity_options]["internship"][:end_date] }
      expose :duration, as: :duration_in_days, if: lambda{|i,o| o[:entity_options]["internship"][:duration_in_days] }
      expose :tags, using: Shapter::Entities::Tag, if: lambda {|i,o| o[:entity_options]["internship"][:tags]}
      expose :address, if: lambda{|i,o| o[:entity_options]["internship"][:address]}
      expose :lat, if: lambda{|i,o| o[:entity_options]["internship"][:lat]}
      expose :lng, if: lambda{|i,o| o[:entity_options]["internship"][:lng]}
      expose :description, if: lambda{|i,o| o[:entity_options]["internship"][:description]} do |i,ops|
        i.public_description(ops[:entity_options][:current_user])
      end
      expose :in_progress?, as: :in_progress, if: lambda{|i,o| o[:entity_options]["internship"][:in_progress]}
    end
  end
end
