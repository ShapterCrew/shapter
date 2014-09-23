File.open("mail_eurecoms.tsv").each_line do |l|
  email = l.chomp.strip
  next if email.blank?
  firstname = email.split(".").first
  lastname = email.split("@").first.split(".").last

  s = SignupPermission.new(
    firstname: firstname,
    lastname: lastname,
    email: email,
    school_names: ["Eurecom"],
  )

  if s.save
    puts "#{s.firstname}\t#{s.lastname}"
  else
    puts s.errors.messages
  end
  
end

User.where(email: /eurecom/).each(&:save)
