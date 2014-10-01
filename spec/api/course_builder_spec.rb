require 'spec_helper'

describe Shapter::V7::CourseBuilder do 

  before(:each) do 
    Tag.delete_all
    Item.delete_all
    User.delete_all

    @user = FactoryGirl.create(:user)
    @tag = FactoryGirl.create(:tag)
    @item = FactoryGirl.create(:item)

    login(@user)
  end

  #{{{ course builder
  describe "course builder" do 

    before do 
        @tag.constructor_funnel = [{name: "haha, recursion!", tag_ids: [@tag.id]}]
        @tag.save
    end

    context "when user doesn't belong to asked school" do 
      it "does NOT deny access" do 
        post "/users/#{@user.id}/courses", :schoolTagId => @tag.id.to_s
        access_denied(@response).should be false
      end
    end
    context "when user belongs to asked school" do 
      it "success" do 
        @tag.update_attribute(:category, :school)
        @user.schools << @tag
        post "/users/#{@user.id}/courses", :schoolTagId => @tag.id.to_s
        access_denied(@response).should be false
        @response.status.should == 201
      end
    end

    end
  #}}} 

end
