File.open("scripts/csv/promo_2017_telecom").each_line do |line|
  lastname,firstname,email = line.chomp.split("\t").map(&:strip)
  puts SignupPermission.new(email: email, firstname: firstname, lastname: lastname, school_names: ["Telecom ParisTech"]).inspect
end
