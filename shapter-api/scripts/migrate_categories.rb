puts "hello there !"

@categories = Hash.new do |h,k|
  k.nil? ? "other" :  h[k] = Category.find(k).code
end

Tag.each do |tag|
  puts tag.name if tag.update_attribute(:category, @categories[tag.category_id])
end
