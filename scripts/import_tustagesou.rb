require "json"
@data = JSON.parse(
  File.read("import.json")
)["users"]


class StageUser
  def initialize(h)
    @h = h
  end

  def title
    company
  end

  def firstname
    @firstname ||= @h["name"].strip.split(" ").first
  end

  def lastname
    @lastname ||= @h["name"].strip.split(" ").last
  end

  def company
    @company ||= @h["company"].strip.downcase.capitalize
  end

  def start_date
    Date.new(2014,8,1)
  end

  def description
    ""
  end

  def end_date
    Date.new(2015,1,1)
  end

  def location
    [lng,lat]
  end

  def lat
    @lat ||= @h["coordinates"].last.to_f
  end

  def lng
    @lng ||= @h["coordinates"].first.to_f
  end

  def address
    @address ||= @h["city"].strip.downcase.capitalize
  end

  def country
    @country ||= @h["country"].strip.downcase.capitalize
  end

  def user
    User.where(firstname: /#{firstname}/i, lastname: /#{lastname}/i).first
  end

  def valid?
    !user.nil?
  end

  def tags
    [
      Tag.schools.find_by(name: "Telecom ParisTech"),
      Tag.find_or_create_by(name: country, category: "geo"),
      Tag.find_or_create_by(name: company, category: "company"),
    ]
  end

end

@data.map{|h| StageUser.new(h)}.select(&:valid?).each do |s|
  i= Internship.new(
    title: s.title,
    start_date: s.start_date,
    end_date: s.end_date,
    address: s.address,
    location: s.location,
    description: s.description,
    tags: s.tags,
    trainee_id: s.user.id,
  )

  if i.save
    puts i.title
  else
    puts i.errors
  end
end
