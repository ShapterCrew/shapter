module Schools
  extend ActiveSupport::Concern

  included do 
    before_validation :set_schools!
  end

  module ClassMethods
    def schools_for(email)
      schools = []

      schools << Tag.find_or_create_by(category: :school, name: "Centrale Lyon") if (email =~ /.*@ecl[0-9]+.ec-lyon.fr/ or email =~ /.*@auditeur.ec-lyon.fr/)

      schools << Tag.find_or_create_by(category: :school, name: "Centrale Paris") if (email =~ /.*@student.ecp.fr/)

      schools << Tag.find_or_create_by(category: :school, name: "ULM") if ( email =~ /.*@clipper.ens.fr/)

      schools << Tag.find_or_create_by(category: :school, name: "HEC") if (email =~ /.*@hec.edu/)

      schools << Tag.find_or_create_by(category: :school, name: "Ponts ParisTech") if (email =~ /.*@eleves.enpc.fr/)

      schools << Tag.find_or_create_by(category: :school, name: "ESPCI") if (email =~ /@bde.espci.fr/)

      schools << Tag.find_or_create_by(category: :school, name: "ESCP Europe") if (email =~ /@edu.escpeurope.eu/)

      schools << Tag.find_or_create_by(category: :school, name: "ENSMA") if (email =~ /@etu.isae-ensma.fr/)

      #schools << Tag.find_or_create_by(category: :school, name: "Eurecom") if (email =~ /@eurecom.fr/)

      if perm = SignupPermission.find_by(email: email.downcase)
        perm.school_names.each do |school_name|
          schools << Tag.find_or_create_by(category: :school, name: school_name)
        end
      end
      return schools
    end
  end

  protected 

  def valid_school?
    unless self.provider == "facebook"
      errors.add(:base,"user must belong to at least one school") if self.schools.empty?
    end
  end

  def set_schools!
    self.schools += self.class.schools_for(self.email)
  end

end
