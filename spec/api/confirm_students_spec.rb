require 'spec_helper'

describe Shapter::V7::ConfirmStudents do 

  before(:each) do 
    Tag.delete_all
    User.delete_all
    @user = FactoryGirl.create(:user)
  end

  #{{{ /me
  describe :me do 

    context "when logged in" do 
      before do 
      end

      it "present current user" do
        login(@user)
        post "users/me", entities: {user: {firstname: true, lastname: true}}
        access_denied(@response).should be false
        h = JSON.parse(@response.body)
        h["firstname"].should == @user.firstname
        h["lastname"].should == @user.lastname
      end
    end

  end

  #}}}

  describe :confirm_open_student do 

    it "confirms a student if school is open" do 
      login(@user)
      s = FactoryGirl.create(:tag)
      s.update_attributes(category: "school")
      @user.update_attributes(school_ids: [])
      @user.confirm!
      Tag.any_instance.stub(:open_school?).and_return(true)

      expect{
        post 'users/me/confirm_open_student', school_id: s.id.to_s
        @user.reload
      }.to change{@user.confirmed_student?}.from(false).to(true)
    end

  end


end
