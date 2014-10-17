#Gros hack pour ouvrir les écoles
module OpenSchools
  extend ActiveSupport::Concern

  def open_school?
    [
      "ENSMA",
      "Dauphine",
      "ESSEC",
    ].include?(name)
  end


end
