Item.where(name: nil).destroy_all
Item.all.flat_map(&:diagrams).each do |diag|
  unless (diag.author and diag.item)
    diag.destroy
    next
  end
  q = diag.values[6]
  next unless q.is_a? Integer
  s = if q < 25
        1
      elsif q < 50
        2
      elsif q < 75
        3
      else
        4
      end
  puts "#{diag.author.name} voted #{s} on #{diag.item.name}"
  diag.author.reco_score_item!(diag.item,3)
end
