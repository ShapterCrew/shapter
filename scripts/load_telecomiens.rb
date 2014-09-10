File.open("scripts/csvs/promo_2017_telecom").each_line do |line|
  lastname,firstname,email = line.chomp.split("\t").map(&:strip)
  puts SignupPermission.create(email: email, firstname: firstname, lastname: lastname, school_names: ["Telecom ParisTech"])
end
