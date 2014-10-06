require 'spec_helper'
describe Shapter::V7::ProfileBoxes do 

  before(:each) do 
    User.delete_all
    ProfileBox.delete_all

    @user = FactoryGirl.create(:user)
    login(@user)

    @i1 = FactoryGirl.create(:item)
    @i2 = FactoryGirl.create(:item)
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
      puts "debug: h=#{h}"

      expect(h.has_key?("id")).to be true
      expect(ProfileBox.count).to eq 1
    end

  end
  #}}}

end
