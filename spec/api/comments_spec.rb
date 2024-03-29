require 'spec_helper'

describe Shapter::V7::Comments do 

  before(:each) do 
    User.any_instance.stub(:confirmed_student?).and_return(true)
    Item.delete_all
    User.delete_all
    Tag.delete_all
    @item = FactoryGirl.create(:item)
    @user = FactoryGirl.create(:user)
    @comment = FactoryGirl.build(:comment)
    @comment.author = @user
  end

  #{{{ get user's comments
  describe "get  users's comments" do 
    it "should present the users's comment" do 
      @comment.item = @item
      @comment.save
      @item.save
      User.any_instance.stub(:comments).and_return([@comment])
      login(@user)

      post "users/#{@user.id}/comments"

      h = JSON.parse(@response.body)
      h.has_key?("comments").should be true
      h["comments"].size.should == 1
      h["comments"].first["id"].should == @comment.id.to_s
    end
  end
  #}}}

  # {{{ create
  describe :create do 
    it "should require login" do 
      post "/items/#{@item.id}/comments/create", :comment => @comment.attributes
      response.status.should == 401
      response.body.should == {error: "please login"}.to_json
    end

    context "when logged in" do 

      before do 
        login(@user)
      end

      it "errors if item is not found" do 
        post "/items/not_valid/comments/create", :comment => @comment.attributes
        response.status.should == 404
        response.body.should == {error: "item not found"}.to_json
      end

      it "should create comment" do 
        User.any_instance.stub(:shapter_admin).and_return(true)
        post "/items/#{@item.id}/comments/create", :comment => @comment.attributes, :entities => {"comment" => {content: true}}
        response.status.should == 201
        h = JSON.parse(response.body)
        h.has_key?("content").should be true
        h.has_key?("id").should be true

        @item.reload
        @item.comments.last.content.should == @comment.content
      end

      it "validates presence of content" do 
        User.any_instance.stub(:shapter_admin).and_return(true)
        post "/items/#{@item.id}/comments/create", :comment => @comment.attributes.merge(:content => nil)
        response.status.should == 400
      end

    end

  end
  #}}}

  #{{{ destroy
  describe :destroy do
    it "should require login" do 
      delete "/items/123/comments/#{@comment.id}"
      response.status.should == 404
      response.body.should =~ /error/
    end

    describe "should check if current_user is either admin, or comment owner" do 
      before do 
        @item.comments << @comment
        @item.save
        @user2 = FactoryGirl.build(:user)
        @user2.email = 'foo2@bar2.com'
        @user2.save
      end

      context :shapter_admin do 
        before do 
          User.any_instance.stub(:shapter_admin).and_return(true)
        end

        it "authorizes admin" do 
          login(@user2)
          @item.comments.size.should == 1
          delete "items/#{@item.id}/comments/#{@comment.id}"
          @response.body.should == {:comment => {:id => @comment.id.to_s, :status => :destroyed}}.to_json
          @item.reload
          @item.comments.size.should == 0
        end
      end

      context :simple_user do 
        before do 
          User.any_instance.stub(:shapter_admin).and_return(false)
        end

        it "authorizes owner" do 
          login(@user)
          @item.comments.size.should == 1
          delete "items/#{@item.id}/comments/#{@comment.id}"
          @response.status.should == 200
          @item.reload
          @item.comments.size.should == 0
        end

        it "doesn't authorize other user" do 
          login(@user2)
          @item.comments.size.should == 1
          delete "items/#{@item.id}/comments/#{@comment.id}"
          @response.status.should == 401
          @response.body.should == {error: "forbidden"}.to_json
          @item.reload
          @item.comments.size.should == 1
        end
      end
    end

  end
  #}}}

  #{{{ score
  describe :score do 
    it "should require login" do 
      put "items/1234/comments/#{@comment.id}/score", :score => 1
      response.status.should == 404
      response.body.should =~ /error/
    end

    context "when logged in" do 
      before do 
        login(@user)
        @item.comments << @comment
        @item.save

        #can't score your own comment. Let's create someone else's comment
        @u2 = FactoryGirl.build(:user) ; @u2.email = "other.email@haha.com" 
        Comment.any_instance.stub(:author).and_return(@u2)
      end

      it "should add to likers when +1" do 
        put "items/#{@item.id}/comments/#{@comment.id}/score", :score => 1
        @comment.reload
        @comment.likers.include?(@user).should be true
        @comment.dislikers.include?(@user).should be false
      end

      #it "should not add to dislikers when -1 and user doesn't belong to school" do 
      #  put "items/#{@item.id}/comments/#{@comment.id}/score", :score => -1
      #  @comment.reload
      #  @comment.likers.include?(@user).should be false
      #  @comment.dislikers.include?(@user).should be false
      #end

      it "should add to dislikers when -1 and user belongs to school" do 
        t = FactoryGirl.create(:tag)
        @item.tags << t ; @item.save
        User.any_instance.stub(:schools).and_return([t])
        User.any_instance.stub(:school_ids).and_return([t.id])
        put "items/#{@item.id}/comments/#{@comment.id}/score", :score => -1
        @comment.reload
        @comment.likers.include?(@user).should be false
        @comment.dislikers.include?(@user).should be true
      end

      it "should remove from like/dislikers when 0" do 
        put "items/#{@item.id}/comments/#{@comment.id}/score", :score => 1
        put "items/#{@item.id}/comments/#{@comment.id}/score", :score => 0
        @comment.reload
        @comment.likers.include?(@user).should be false
        @comment.dislikers.include?(@user).should be false
      end

      it "should error when score is not in [-1,0,1]" do 
        put "items/#{@item.id}/comments/#{@comment.id}/score", :score => 3
        @response.status.should == 500
        @response.body.should == {error: "invalid score parameter"}.to_json
      end

    end

  end
  #}}}

  #{{{ update
  describe :update do 
    it "should update comment" do 
      @comment.item = @item
      @comment.save
      login(@user)
      new_content = "hahaha hohohoh"
      @comment.content.should_not == new_content

      put "items/#{@item.id}/comments/#{@comment.id}", :comment => {:content => new_content}

      @comment.reload
      @comment.content.should == new_content
    end
  end
  #}}}

  #{{{ likers
  describe :likers do 
    it "presents the users that like the comment" do 
      @comment.item = @item
      @comment.likers << @user
      @comment.save
      login(@user)

      post "items/#{@item.id}/comments/#{@comment.id}/likers"

      h = JSON.parse(@response.body)
      h.has_key?("likers").should be true
      h["likers"].first["id"].should == @user.id.to_s
    end
  end
  #}}}

  #{{{ dislikers
  describe :dislikers do 
    it "presents the users that dislike the comment" do 
      @comment.item = @item
      @comment.dislikers << @user
      @comment.save
      login(@user)

      post "items/#{@item.id}/comments/#{@comment.id}/dislikers"

      h = JSON.parse(@response.body)
      h.has_key?("dislikers").should be true
      h["dislikers"].first["id"].should == @user.id.to_s
    end
  end
  #}}}

end
