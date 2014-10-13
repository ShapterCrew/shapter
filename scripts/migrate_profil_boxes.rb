# /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\ 
#
#    DO NOT USE THIS SCRIPT IN PRODUCTION !!
#
# /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\  /!\ 
exit if Rails.env.production?

#Tag.schools.each do |school|
Tag.schools.where(name: "Centrale Lyon").each do |school|
  funnel = school.constructor_funnel || school.signup_funnel || next
  school.students.each do |user|

    funnel.each_with_index do |step,i|
      step_name = step["name"]
      step_tags = step["tag_ids"]

      start_date = [
        Date.new(2012,9,1),
        Date.new(2013,2,1),
        Date.new(2013,9,1),
        Date.new(2014,2,1),
        Date.new(2014,1,1),
        Date.new(2014,2,1),
        Date.new(2013,9,1),
      ][i]

      end_date = [
        Date.new(2013,1,28),
        Date.new(2013,5,28),
        Date.new(2013,12,28),
        Date.new(2014,2,28),
        Date.new(2014,2,28),
        Date.new(2014,5,28),
        Date.new(2014,2,28),
      ][i]

      course_ids = user.items.all_in('tag_ids' => step_tags).only(:id).map(&:id)

      if course_ids.any?

        pb = ProfileBoxItem.new(
          users: [user],
          name: step_name,
          start_date: start_date,
          end_date:  end_date,
          item_ids: course_ids,
        )

        if pb.save
          puts "#{user.name}\t#{pb.name}" 
        else
          puts pb.errors.messages
        end

      end

    end

  end
end
