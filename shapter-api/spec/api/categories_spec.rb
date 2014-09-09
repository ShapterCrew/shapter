require 'spec_helper'
describe Shapter::V7::Categories do 

  before(:each) do 
    User.delete_all
    Tag.delete_all

    @t = FactoryGirl.create(:tag)

    @user = FactoryGirl.create(:user)
    login(@user)
  end

  #{{{ index
  describe :index do 
    
    it "lists all categories" do 
      post "categories"
      h = JSON.parse(@response.body)
      expect( h.has_key?("categories") ).to be true
      expect( h["categories"].first["code"] ).to eq @t.category_code
    end

  end
  #}}}

end
