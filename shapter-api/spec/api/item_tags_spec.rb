require 'spec_helper'
describe Shapter::V7::ItemTags do 

  before(:each) do 
    Tag.delete_all
    Item.delete_all
    User.delete_all
    @user = FactoryGirl.create(:user)
    User.any_instance.stub(:shapter_admin).and_return(:true)
    login(@user)
  end

  #{{{ add
  describe :add do 
    before do 

      @i1 = Item.create(name: "i1")
      @i2 = Item.create(name: "i2")
      @i3 = Item.create(name: "i3")

      @c1 = Tag.acceptable_categories[0]
      @c2 = Tag.acceptable_categories[1]
      @c3 = Tag.acceptable_categories[2]

      @t1 = Tag.create(name: 't1', category: @c1)
      @t2 = Tag.create(name: 't2', category: @c2)
      @t3 = Tag.create(name: 't3', category: @c3)

    end

    it "add a list of tags to a list of items" do 
      item_ids = [@i1,@i2,@i3].map(&:id).map(&:to_s)
      tags  = [@t1,@t2,@t3].map do |tag|
        {category: tag.category, tag_name: tag.name}
      end
      post "items/tags/add", {item_ids: item_ids, tags: tags}

      h = JSON.parse(@response.body)
      expect( h.has_key?("status") ).to be true
      expect( h["status"] ).to eq "added"

      [@t1,@t2,@t3,@i1,@i2,@i3].each(&:reload)

      expect(@t1.items).to match_array [@i1,@i2,@i3]
      expect(@t2.items).to match_array [@i1,@i2,@i3]
      expect(@t3.items).to match_array [@i1,@i2,@i3]

      expect(@i1.tags).to match_array [@t1, @t2, @t3]
      expect(@i2.tags).to match_array [@t1, @t2, @t3]
      expect(@i3.tags).to match_array [@t1, @t2, @t3]

    end

  end
  #}}}

  #{{{ delete
  describe :delete do 
    before do 

      @i1 = Item.create(name: "i1")
      @i2 = Item.create(name: "i2")

      @t1 = Tag.create(name: 't1', category: Tag.acceptable_categories[0])
      @t2 = Tag.create(name: 't2', category: Tag.acceptable_categories[1])
      @t3 = Tag.create(name: 't3', category: Tag.acceptable_categories[2])

      @i1.tags << @t1
      @i1.tags << @t2
      @i1.tags << @t3

      @i2.tags << @t1
      @i2.tags << @t2
      @i2.tags << @t3

      [@i1,@i2,@t1,@t2,@t3].each(&:save)

    end

    it "deletes a batch of tags from a batch of items" do 
      [@t1,@t2,@t3,@i1,@i2].each(&:reload)

      expect(@t1.items).to eq [@i1,@i2]
      expect(@t2.items).to eq [@i1,@i2]
      expect(@t3.items).to eq [@i1,@i2]

      expect(@i1.tags).to eq [@t1, @t2, @t3]
      expect(@i2.tags).to eq [@t1, @t2, @t3]

      item_ids = [@i1,@i2].map(&:id).map(&:to_s)
      tags = [@t2,@t3].map{|t| {tag_name: t.name, category: t.category}}
      post "items/tags/delete", {tags: tags, item_ids: item_ids}

      h = JSON.parse(response.body)
      expect( h.has_key?("status") ).to be true
      expect( h["status"] ).to eq "deleted"

      [@t1,@t2,@t3,@i1,@i2].each(&:reload)

      expect(@t1.items).to eq [@i1,@i2]
      expect(@t2.items).to eq []
      expect(@t3.items).to eq []

      expect(@i1.tags).to eq [@t1]
      expect(@i2.tags).to eq [@t1]

    end

  end
  #}}}

end
