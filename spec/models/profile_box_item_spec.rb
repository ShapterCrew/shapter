require 'spec_helper'

describe ProfileBoxItem do
  before(:each) do 
    Item.delete_all
    Tag.delete_all
    User.delete_all

    @t1 = Tag.create(type: "other", name: "t1")
    @t2 = Tag.create(type: "other", name: "t2")
    @t3 = Tag.create(type: "other", name: "t3")

    @i1 = Item.create(name: "item1")
    @i2 = Item.create(name: "item2")
    @i3 = Item.create(name: "item3")

    @pb = FactoryGirl.build(:profile_box_item)

    @u = FactoryGirl.create(:user)
    @pb.users = [@u]
  end

  #{{{ items
  describe :items do 

    it "add/remove_item works item" do 
      expect(@pb.items.include?(@i1)).to be false
      expect(@pb.items.include?(@i2)).to be false
      @pb.add_item!(@i1)
      @pb.add_item!(@i2.id)
      expect(@pb.items.include?(@i1)).to be true
      expect(@pb.items.include?(@i2)).to be true

      @pb.remove_item!(@i1)
      @pb.remove_item!(@i2.id)
      expect(@pb.items.include?(@i1)).to be false
      expect(@pb.items.include?(@i2)).to be false
    end

  end
  #}}}

  #{{{ tag_ids
  describe :tag_ids do 

    it "create sets tag_ids" do 

      @i1.tags << @t1 ; @i1.tags << @t3
      @i2.tags << @t2 ; @i2.tags << @t3


      pb = FactoryGirl.build(:profile_box_item)
      pb.users << @u
      pb.add_item!(@i1)
      pb.add_item!(@i2)

      pb.save
      pb.reload

      expect(pb.tag_ids).to match_array([@t3.id])
      expect(pb.tags).to match_array([@t3])
    end

  end
  #}}}

  #{{{ autodestroy
  describe :autodestroy do 
    it "should destroy itself when emptied" do 
      @pb.add_item!(@i1)
      @pb.save
      @pb.reload
      #byebug
      expect(@pb.valid?).to be true
      @pb.remove_item!(@i1) 
      expect{ @pb.save }.to change{ProfileBoxItem.count}.by(-1)
    end
  end
  #}}}

  #{{{ user_items_callbacks
  describe :user_items_callbacks do 
    it "adds and removes items to user.items when saved" do 
      expect{
      @pb.add_items!([@i1,@i2])
      @pb.save
      }.to change{@u.item_ids}.from([]).to([@i1.id,@i2.id])

      expect{
      @pb.remove_item!(@i1)
      @pb.save
      }.to change{@u.item_ids}.from([@i1.id,@i2.id]).to([@i2.id])
    end
    it "adds and removes items to item.subscribers when saved" do 
      expect{
      @pb.add_items!([@i1,@i2])
      @pb.save
      @i1.reload
      }.to change{@i1.subscriber_ids}.from([]).to([@u.id])

      expect{
      @pb.remove_item!(@i1)
      @pb.save
      @i1.reload
      }.to change{@i1.subscriber_ids}.from([@u.id]).to([])
    end

    it "removes items from user.items when destroyed" do 
      @pb.add_item!(@i1)
      @pb.save
      @u.reload
      expect{
        @pb.destroy
      }.to change{@u.item_ids}.from([@i1.id]).to([])
    end

    it "removes user from items.users when destroyed" do 
      @pb.add_item!(@i1)
      @pb.save
      @i1.reload
      expect{
        @pb.destroy
        @i1.reload
      }.to change{@i1.subscriber_ids}.from([@u.id]).to([])
    end

  end
  #}}}

end
