Item.each do |item|
  puts item.update_attribute(:lovers_count, (item.lover_ids.count rescue 0))
end
