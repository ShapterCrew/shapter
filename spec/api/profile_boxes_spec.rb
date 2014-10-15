require 'spec_helper'
describe Shapter::V7::ProfileBoxes do 

  before(:each) do 
    User.delete_all
    ProfileBox.delete_all

    @user = FactoryGirl.create(:user)
    login(@user)

    @i1 = FactoryGirl.create(:item)
    @i2 = FactoryGirl.create(:item)
    @i3 = FactoryGirl.create(:item)
    @i4 = FactoryGirl.create(:item)
  end

  #{{{ create
  describe :create do 

    it "creates a box" do 
      p = {
        name: (name = "haha"),
        start_date: (start_date = Date.today),
        end_date: (end_date = Date.today + 3),
        item_ids: [@i1,@i2].map(&:id).map(&:to_s),
      }
      expect(ProfileBox.count).to eq 0

      post "/profile_boxes/create", p
      h = JSON.parse(@response.body)

      expect(h.has_key?("id")).to be true
      expect(ProfileBox.count).to eq 1
    end

  end
  #}}}

  #{{{ delete
  describe :delete do 
    it "deletes profil box" do 
      @pb = FactoryGirl.build(:profile_box_item)
      @pb.users = [@user]
      @pb.add_item!(FactoryGirl.create(:item))
      @pb.save
      expect(ProfileBox.count).to eq 1
      expect{delete "profile_boxes/#{@pb.id}"}.to change{ProfileBox.count}.by(-1)
    end
  end
  #}}}

  #{{{ update
  describe :update do 
    before do 
      @p = {
        name: (@name = "haha"),
        start_date: (@start_date = Date.today),
        end_date: (@end_date = Date.today + 3),
        users: [@user],
      }
      @item_ids =  [@i1,@i2].map(&:id).map(&:to_s),

        @p2 = {
        name: (@name2 = "hohoho"),
        start_date: (@start_date2 = Date.today + 5),
        end_date: (@end_date2 = Date.today + 13),
        item_ids: (@item_ids2 = [@i3].map(&:id).map(&:to_s)),
      }

        @pb = ProfileBoxItem.new(@p)
        @pb.add_items!([@i1,@i2])
        @pb.save
    end

    it "is properly initialized" do 
      expect(@pb.valid?).to be true
      expect(@pb.items).to match_array([@i1,@i2])
    end

    it "does not change keys that are not given" do 
      put "/profile_boxes/#{@pb.id}", {}
      @pb.reload
      expect(@pb.name).to eq @name
    end

    it "changes name" do 
      expect{ put "/profile_boxes/#{@pb.id}", @p2 ; @pb.reload}.to change{@pb.name}.from(@name).to(@name2)
    end

    it "changes start_date" do 
      expect{ put "/profile_boxes/#{@pb.id}", @p2 ; @pb.reload}.to change{@pb.start_date}.from(@start_date).to(@start_date2)
    end

    it "changes end_date" do 
      expect{ put "/profile_boxes/#{@pb.id}", @p2 ; @pb.reload}.to change{@pb.end_date}.from(@end_date).to(@end_date2)
    end

    it "changes name" do 
      expect{ put "/profile_boxes/#{@pb.id}", @p2 ; @pb.reload}.to change{@pb.name}.from(@name).to(@name2)
    end

    it "changes item_ids" do 
      expect(@pb.items).to match_array([@i1,@i2])
      put "/profile_boxes/#{@pb.id}", @p2 
      @pb.reload
      expect(@pb.items).to match_array([@i3])
    end

  end
  #}}}

  #{{{ add and remove items
  describe "add_and_remove_items" do 
    before do 
      @pb = FactoryGirl.build(:profile_box_item)
      @pb.users = [@user]
      @pb.add_items!([@i1,@i2])
      @pb.save
    end

    it "add_items add items" do 
      expect{
        post "profile_boxes/#{@pb.id}/add_items", item_ids: [@i1,@i3,@i4].map(&:id).map(&:to_s)
        @pb.reload
      }.to change{@pb.item_ids}.from([@i1,@i2].map(&:id).sort).to([@i1,@i2,@i3,@i4].map(&:id).sort)
    end

    it "remove_items remove items" do 
      expect{
        post "profile_boxes/#{@pb.id}/remove_items", item_ids: [@i1,@i3].map(&:id).map(&:to_s)
        @pb.reload
      }.to change{@pb.item_ids}.from([@i1,@i2].map(&:id).sort).to([@i2].map(&:id).sort)
    end

  end
  #}}}

end
