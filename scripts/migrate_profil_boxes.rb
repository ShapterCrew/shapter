#ProfileBox.destroy_all

#{{{ import!
def import!
  puts "---------------"
  puts @school.name
  @school.students.only(:id,:firstname,:lastname,:item_ids,:profile_box_ids).each do |user|

    user.internships.each do |internship|
      print "[Internship]\t#{user.name}'s internship\t"
      p = ProfileBoxInternship.new(internship: internship)
      if p.save
        print "ok\n"
      else
        print "ERROR!!! #{p.errors.messages}\n"
      end
    end

    @tags.each_with_index do |tag_list,i|
      is = user.items.all_in(tag_ids: tag_list.map(&:id)).only(:id)
      if is.any?
        p = ProfileBoxItem.new(
          user_ids: [user.id],
          name: @steps[i],
          start_date: @begin_dates[i],
          end_date: @end_dates[i],
          item_ids: is.map(&:id),
        )
        print "[Item]\t#{p.name} for #{user.name}\t"
        if p.save
          print "ok\n"
        else
          print "ERROR!!! #{p.errors.messages}\n"
        end
      end
    end

    user.order_profile!
  end
end
#}}}

#{{{ Centrale Lyon
puts "Centrale Lyon"
@school = Tag.schools.find_by(name: "Centrale Lyon")
@steps = [
  "Électifs Semestre 7",
  "Électifs Semestre 8",
  "Modules Ouverts Disciplinaires",
  "Modules Ouverts Métier",
  "Modules Ouvers Sectoriels",
  "Option 3A",
  "Métier 3A",
]

@tags = [
  (["Électifs Semestre 7"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Électifs Semestre 8"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Modules Ouverts Disciplinaires"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Modules Ouverts Metier"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Modules Ouverts Sectoriels"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Option 3A"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Métier 3A"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2012,9,1),
  Date.new(2013,3,1),
  Date.new(2013,10,1),
  Date.new(2014,2,1),
  Date.new(2014,2,1),
  Date.new(2014,2,1),
  Date.new(2013,9,1),
]

@end_dates = [
  Date.new(2013,2,28),
  Date.new(2013,5,30),
  Date.new(2014,1,30),
  Date.new(2014,2,28),
  Date.new(2014,2,28),
  Date.new(2014,4,30),
  Date.new(2014,2,28),
]

import!
#}}}

#{{{ Eurecom
puts "Eurecom"
@school = Tag.schools.find_by(name: "Eurecom")
@steps = [
  "General Fall",
  "Technique Fall",
  "Genral Spring",
  "Technique Spring",
]

@tags = [
  (["General"  , "Fall"  ].map{|tname| Tag.where(name: tname).only(:id).first} << @school),
  (["Technique", "Fall"  ].map{|tname| Tag.where(name: tname).only(:id).first} << @school),
  (["General"  , "Spring"].map{|tname| Tag.where(name: tname).only(:id).first} << @school),
  (["Technique", "Spring"].map{|tname| Tag.where(name: tname).only(:id).first} << @school),
]

@begin_dates = [
  Date.new(2013,9,1),
  Date.new(2013,9,1),
  Date.new(2014,1,1),
  Date.new(2014,1,1),
]

@end_dates = [
  Date.new(2014,1,1),
  Date.new(2014,1,1),
  Date.new(2014,6,1),
  Date.new(2014,6,1),
]

import!
#}}}

#{{{ Telecom ParisTech
puts "Telecom ParisTech"
@school = Tag.schools.find_by(name: "Telecom ParisTech")
@steps = [
  "Culture Générale",
  "Formation Humaine",
  "Langues",
  "P1",
  "P2",
  "P3",
  "P4",
]

@tags = [
  (["Culture Générale"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Formation Humaine"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Langues"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Sciences & Techniques", "P1"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Sciences & Techniques", "P2"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Sciences & Techniques", "P3"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Sciences & Techniques", "P4"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2013,9,1),
  Date.new(2013,9,1),
  Date.new(2013,9,1),
  Date.new(2013,9,1),
  Date.new(2013,11,1),
  Date.new(2014,1,1),
  Date.new(2014,3,1),
]

@end_dates = [
  Date.new(2014,6, 1),
  Date.new(2014,6, 1),
  Date.new(2014,6, 1),
  Date.new(2013,11,1),
  Date.new(2014,1, 1),
  Date.new(2014,3, 1),
  Date.new(2014,6, 1),
]

import!
#}}}

#{{{ ENSMA
puts "ENSMA"
@school = Tag.schools.find_by(name: "ENSMA")
@steps = [
  "Semestre 1",
  "Semestre 2",
  "Semestre 3",
  "Semestre 4",
]

@tags = [
  (["SHES", "S1"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["SHES", "S2"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["SHES", "S3"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["SHES", "S4"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2012,9,1),
  Date.new(2013,1,1),
  Date.new(2013,9,1),
  Date.new(2014,1,1),
]

@end_dates = [
  Date.new(2013,1,1),
  Date.new(2013,6,1),
  Date.new(2014,1,1),
  Date.new(2015,6,1),
]

import!
#}}}

#{{{ ESCP Europe
puts "ESCP Europe"
@school = Tag.schools.find_by(name: "ESCP Europe")
@steps = [
  "Semestre 1",
  "Semestre 2",
]

@tags = [
  (["SSH", "S1"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["SSH", "S2"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2013,9,1),
  Date.new(2014,1,1),
]

@end_dates = [
  Date.new(2014,1,1),
  Date.new(2014,6,1),
]

import!
#}}}

#{{{ ULM
puts "ULM"
@school = Tag.schools.find_by(name: "ULM")
@steps = [
  "L3",
  "M1",
  "M2",
]

@tags = [
  (["L3"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["M1"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["M2"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2011,9,1),
  Date.new(2012,9,1),
  Date.new(2013,9,1),
]

@end_dates = [
  Date.new(2012,6,1),
  Date.new(2013,6,1),
  Date.new(2014,6,1),
]

import!
#}}}

#{{{ Dauphine
puts "Dauphine"
@school = Tag.schools.find_by(name: "Dauphine")
@steps = [
  "Semestre 7",
  "Semestre 8",
]

@tags = [
  (["Semestre 7"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Semestre 8"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2013,9,1),
  Date.new(2014,1,1),
]

@end_dates = [
  Date.new(2014,1,1),
  Date.new(2014,6,1),
]

import!
#}}}

#{{{ Supélec
puts "Supélec"
@school = Tag.schools.find_by(name: "Supélec")
@steps = [
  "Séquence 1",
  "Séquence 2",
  "Séquence 3",
  "Séquence 4",
  "Séquence 5",
  "Séquence 6",
  "Séquence 7",
  "Séquence 8",
]

@tags = [
  (["Séquence 1"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 2"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 3"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 4"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 5"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 6"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 7"].map{|tname| Tag.find_by(name: tname)} << @school),
  (["Séquence 8"].map{|tname| Tag.find_by(name: tname)} << @school),
]

@begin_dates = [
  Date.new(2012,9,1),
  Date.new(2012,11,1),
  Date.new(2013,1,1),
  Date.new(2013,3,1),
  Date.new(2013,9,1),
  Date.new(2013,11,1),
  Date.new(2014,1,1),
  Date.new(2014,3,1),
]

@end_dates = [
  Date.new(2012,11,1),
  Date.new(2013,1,1),
  Date.new(2013,3,1),
  Date.new(2013,6,1),
  Date.new(2013,11,1),
  Date.new(2014,1,1),
  Date.new(2014,3,1),
  Date.new(2014,6,1),
]

import!
#}}}

