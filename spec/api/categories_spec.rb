require 'spec_helper'
describe Shapter::V7::Categories do 

  before(:each) do 
    User.delete_all
    Tag.delete_all

    @user = FactoryGirl.create(:user)
    login(@user)
  end

  #{{{ index
  describe :index do 
    
    it "lists all categories for items" do 
      post "categories/for_items"
      h = JSON.parse(@response.body)
      expect( h.has_key?("categories") ).to be true
      expect( h["categories"]).to eq Item.acceptable_categories
    end

    it "lists all categories for internships" do 
      post "categories/for_internships"
      h = JSON.parse(@response.body)
      expect( h.has_key?("categories") ).to be true
      expect( h["categories"]).to eq Internship.acceptable_categories
    end

  end
  #}}}

end
