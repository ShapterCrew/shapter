#Gros hack pour ouvrir les écoles
module OpenSchools
  extend ActiveSupport::Concern

  def open_school?
    [
      "ENSMA",
      "Dauphine",
    ].include?(name)
  end


end
