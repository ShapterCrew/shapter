class FormationPage
  include Mongoid::Document
  include Clustering

  field :name
  field :website_url
  field :description
  field :image_credits

  mount_uploader :logo, FileUploader
  mount_uploader :image, FileUploader

  field :tag_ids, type: Array

  validates_uniqueness_of :tag_ids
  validates_presence_of :tag_ids

  before_save :tag_ids_to_bson

  def logo_url
    logo.url
  end

  def image_url
    image.url
  end

  class << self
    #array of tags, tag_ids.to_s or tag_ids can be passed
    def find_by_tags(ary)
      a = ary.map do |id|
        if id.is_a?(Tag)
          id.id
        elsif id.is_a? BSON::ObjectId
          id
        elsif id.is_a? String
          BSON::ObjectId.from_string(id)
        else
          raise "find_by_tag: unacceptable type in ary: #{id.class}"
        end
      end
      FormationPage.all_in(tag_ids: a).where(:tag_ids.with_size => a.size).first
    end

    def find_or_create_by_tags(ary)
      find_by_tags(ary) || FormationPage.new(tag_ids: ary)
    end
  end

  def pretty_id
    id.to_s
  end

  def tags
    Tag.any_in(id: tag_ids)
  end

  def item_ids
    Rails.cache.fetch("frmPgeitm_ids|#{cache_id}|#{tags.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      tags.distinct(:item_ids)
    end
  end

  def items
    Item.any_in(id: item_ids)
  end

  def student_ids
    Rails.cache.fetch("frmPgeStdt_ids|#{cache_id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      items.distinct(:subscriber_ids)
    end
  end

  def students
    Rails.cache.fetch("frmPgeStdts|#{cache_id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      User.any_in(id: student_ids)
    end
  end

  def students_count
    student_ids.count
  end

  def sub_formations
    Rails.cache.fetch("frmPgeSbFrmtn|#{cache_id}|#{Tag.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      Tag.where(category: :formation).any_in(id: items.distinct(:tag_ids)).not.any_in(id: tag_ids)
    end
  end

  def sub_choices
    Rails.cache.fetch("frmPgeSbChcs|#{cache_id}|#{Tag.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      Tag.where(category: :choice).any_in(id: items.distinct(:tag_ids)).not.any_in(id: tag_ids)
    end
  end

  def sub_departments
    Rails.cache.fetch("frmPgeSbDprtmnt|#{cache_id}|#{Tag.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      Tag.where(category: :department).any_in(id: items.distinct(:tag_ids)).not.any_in(id: tag_ids)
    end
  end

  def comments_count
    items.map(&:comments_count).reduce(:+)
  end

  def diagrams_count
    items.map(&:diagrams_count).reduce(:+)
  end

  def best_comments(n=5)
    Rails.cache.fetch("bestCmmt|#{cache_id}|#{items.max(:updated_at).try(:utc).try(:to_s, :number)}", expires_in: 3.hours) do 
      self.items
      .select{|i| [i.comments.map(&:author_id) & i.diagrams.map(&:author_id)].any?}
      .select{|i| i.diagrams.count > 1}
      .select{|i| i.avg_diag.values[6] > 50}
      .sort_by{|i| i.avg_diag.values[6]}.reverse
      .take(n)
      .map do |item|
        item.comments
        .sort_by{|c| c.likers_count*(item.diagrams.where(author_id: c.author_id).last.values[6] || 0 rescue 0) }
        .last
      end
      .compact
    end
  end


  # Get n students profiles, that belong to this formation
  def typical_users(n=1,randomize=true)
    ids = items.flat_map {|item|
      item.subscriber_ids
    }.reduce(Hash.new(0)) { |h,id|
      h[id] += 1
      h
    }
    .sort_by{|k,v| v}.reverse
    .take(2*n)
    .sample(n)
    .map(&:first)

    User.any_in(id: ids)
  end

  #{{{ formation_page_internships
  #look for the internships related to the specified formation page.
  #the formation page is specified through the tag_ids array.
  def true_internships
    Rails.cache.fetch("trueIntrnshp|#{cache_id}", expires_in: 5.minutes) do  #couldn't think of a proper cache key (yet)

      students_with_items = self.items
      .flat_map(&:subscribers)
      .reject{|u| u.internship_ids == nil}
      .group_by{|_| _}

      # nb of items the user that belong to f took in f
      nb_of_items = students_with_items.map{|k,v| v.size}

      if nb_of_items.empty?
        return []
      elsif nb_of_items.size > 1
        # Cluster nb_of_items to detect 'true' students
        c1,c2 = twomeans(nb_of_items)

        n_min = c2.nodes.min #true students share at least n_min items with f
      else
        n_min = nb_of_items.first
      end

      true_students = students_with_items.map do |k,v|
        k if v.size >= n_min
      end.compact

      true_students.flat_map(&:internships).compact.uniq
    end
  end
  #}}}

  private

  def cache_id
    # tags is used instead of tag_ids => passing an id that doesn't match any tag won't alter the cache_id key
    tags.map(&:id).map(&:to_s).join(";")
  end

  def tag_ids_to_bson
    tag_ids.map! do |id|
      id.is_a?(BSON::ObjectId) ? id : BSON::ObjectId.from_string(id)
    end
  end

end
