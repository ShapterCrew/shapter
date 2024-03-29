require 'spec_helper'

describe Shapter::V7::Users do 

  before(:each) do 
    User.delete_all
    Item.delete_all
    Tag.delete_all
    @user = FactoryGirl.create(:user)

    @user2 = FactoryGirl.build(:user)
    @user2.email = "another_email@haha.com"
    @user2.provider = "facebook"
    @user2.uid = "123"
    @user2.save
    @user2.reload
  end

  #{{{ /me
  describe :me do 

    context "when logged in" do 
      before do 
        login(@user)
      end

      it "present current user" do
        post "users/me", entities: {user: {firstname: true, lastname: true}}
        access_denied(@response).should be false
        h = JSON.parse(@response.body)
        h["firstname"].should == @user.firstname
        h["lastname"].should == @user.lastname
      end
    end

  end

  #}}}

  #{{{ comment_pipe
  describe "comment-pipe" do

    before do
      login(@user)
      @i1 = FactoryGirl.create(:item)
      @i2 = FactoryGirl.create(:item)
      @i3 = FactoryGirl.create(:item)
      @i4 = FactoryGirl.create(:item)
      is = [@i1,@i2,@i3,@i4]

      @user.items << @i1
      @user.items << @i2
      @user.items << @i3


      @i2.stub(:interested_users_count).and_return(1)
      @i3.stub(:subscribers_count).and_return(2)

      [@i1,@i2,@i3].each(&:save)

    end

    it "should get 1 item to comment" do 
      post "/users/me/comment-pipe", n: 1
      h = JSON.parse(@response.body)
      h["commentable_items"].size.should == 1
    end

    it "should get 3 items in proper order" do 
      post "/users/me/comment-pipe", n: 3, entities: {item: {requires_comment_score: true}}
      h = JSON.parse(@response.body)
      h["commentable_items"].size.should == 3
      h["commentable_items"].sort_by{|h| h["requires_comment_score"]}.reverse.map{|h| h["id"]}.should == [@i2,@i1,@i3].map(&:id).map(&:to_s)
    end

    it "should accept the school_id param" do 
      #cat = Category.find_or_create_by(code: :school)
      @school1 = Tag.create(name: "school1", category: :school)
      @school2 = Tag.create(name: "school2", category: :school)

      @i1.tags << @school1 
      @i2.tags << @school2
      @i3.tags << @school2

      @school1.save ; @school2.save

      post "/users/me/comment-pipe", n: 3, entities: {item: {requires_comment_score: true}}, school_id: @school2.id.to_s
      h = JSON.parse(@response.body)
      h["commentable_items"].size.should == 2
      h["commentable_items"].sort_by{|h| h["requires_comment_score"]}.reverse.map{|h| h["id"]}.should == [@i2,@i3].map(&:id).map(&:to_s)
    end

  end
  #}}}

  #{{{ confirm student
  describe "confirm student" do 
    before do 
      login(@user2)

      @user.stub(:provider).and_return(nil)

      @tag = FactoryGirl.create(:tag)
    end

    context "when email is no student email" do 
      it "errors" do 
        post "users/me/confirm_student_email", :email => "omg_so_wrong"
        @response.status.should == 500
        @response.body.should =~ /email format/
      end
    end

    context "when email is student email" do 
      before do 
        User.stub(:schools_for).and_return([@tag])
      end

      context "when email already exists" do 
        it "errors when empty password" do 
          post "users/me/confirm_student_email", :email => @user.email, :password => nil
          @response.status.should == 500
          @response.body.should =~ /password/
        end
        it "errors when wrong password" do 
          post "users/me/confirm_student_email", :email => @user.email, :password => "nope"
          @response.status.should == 500
          @response.body.should =~ /password/
        end
        it "merge accounts when right password" do 
          User.any_instance.stub(:confirmed_student?).and_return(false)
          id1 = @user.id.dup
          id2 = @user2.id.dup
          post "users/me/confirm_student_email", :email => @user.email, :password => @user.password
          User.where(id: id2).exists?.should be false
          user = User.find(id1)
          user.uid.should == "123"
          user.provider.should == "facebook"
        end
      end

      context "when email doesn't already exists" do 
        it "associates new email to existing account" do 
          new_email = "new_valid_email@haha.com"
          post "users/me/confirm_student_email", :email => new_email
          @user2.reload
          @user2.email.should == new_email
        end
      end

    end


  end
  #}}}

  #{{{ social
  describe :social do 
    before do
      login(@user)
      User.any_instance.stub(:confirmed_student?).and_return(true)
    end
    it "should respond" do 
      post "/users/me/social"
      r = JSON.parse(@response.body)
      r.has_key?("alike_users").should be true
      r.has_key?("friends").should be true
    end
  end
  #}}}

  #{{{ latest_comments
  describe :latest_comments do 
    before do
      @item = FactoryGirl.create(:item)
      @comment = FactoryGirl.build(:comment)
      @comment.author = @user2
      @comment.item = @item
      @comment.save
      @item.save

      login(@user)
    end

    it "should present constructor items lastest comments" do 
      @user.constructor_items << @item
      post "/users/me/latest_comments"
      h = JSON.parse(@response.body)
      h.has_key?("constructor_item_comments").should be true
      h["constructor_item_comments"].first["id"].should == @comment.id.to_s
    end

    it "should present my items latest comments" do 
      @user.items << @item
      post "/users/me/latest_comments"
      h = JSON.parse(@response.body)
      h.has_key?("my_item_comments").should be true
      h["my_item_comments"].first["id"].should == @comment.id.to_s
    end


    it "should present cart items lastest comments" do 
      @user.cart_items << @item
      post "/users/me/latest_comments"
      h = JSON.parse(@response.body)
      h.has_key?("cart_item_comments").should be true
      h["cart_item_comments"].first["id"].should == @comment.id.to_s
    end
  end
  #}}}

end
