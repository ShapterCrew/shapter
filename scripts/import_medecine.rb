@medecine = Tag.schools.find_or_create_by(name: "Médecine Paris")
header = [
  :item_name,
  :geo,
  :geo,
  :department,
  :teacher,
  :teacher,
  :other,
  :other,
]

File.open('./result_medecine.csv').each_line do |l|
  ll = l.chomp.split(";").map(&:strip)


  tags = ll.zip(header).reject{|a| a.first.blank?}.map do |s,k|
    if k == :item_name
      Tag.find_or_create_by(name: s, category: k)
    else
      s.split(',').map(&:strip).map do |ss|
      Tag.find_or_create_by(name: ss, category: k) unless ss.blank?
      end
    end
  end.compact.flatten
  tags << @medecine

  item = Item.new(name: ll.first, tags: tags)

  puts item.name if item.save
end
