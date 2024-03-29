require 'spec_helper'

describe Item do
  before(:each) do 
    User.delete_all
    Item.delete_all
    @user = FactoryGirl.create(:user)
    @item = FactoryGirl.create(:item)
  end

  #{{{ current_user_subscribed?
  describe :current_user_subscribed? do

    it "returns false if user didn't subscribed" do 
      @item.user_subscribed?(@user).should be false
    end

    it "returns true if user subscribed" do 
      @item.subscribers << @user ; @item.save ; @item.reload
      @item.user_subscribed?(@user).should be true
    end
  end
  #}}}

  #{{{ current_user_has_in_cart?
  describe :current_user_has_in_cart? do

    it "returns false if user don't have in cart" do 
      @item.user_has_in_cart?(@user).should be false
    end

    it "returns true if user has in cart" do 
      @item.interested_users << @user ; @item.save ; @item.reload
      @item.user_has_in_cart?(@user).should be true
    end
  end
  #}}}

  #{{{ user_comments_count
  describe "user_comments_count" do
    it "returns the number of comments the user wrote" do 
      @item.user_comments_count(@user).should == 0
      c = FactoryGirl.build(:comment)
      c.author = @user
      @item.comments << c ; @item.save ; @item.reload
      @item.user_comments_count(@user).should == 1
    end
  end
  #}}}

  #{{{ Item.touch
  describe "self.touch" do 
    it "should update" do 
      t = Time.now
      Item.max(:updated_at).should < t
      Item.touch
      Item.max(:updated_at).should > t
    end
  end
  #}}}

  #{{{ avg_diag
  describe :avg_diag do 
    it 'averages diagrams' do 
      d1 = Diagram.new(
        #item: @item,
        values: [0,1,2,3,4],
        author: @user,
      )
      d2 = Diagram.new(
        #item: @item,
        values: [0,2,4,6,8],
        author: @user,
      )

      @item.diagrams.count.should == 0
      @item.diagrams << d1
      @item.diagrams << d2
      @item.save
      @item.reload

      @item.diagrams.count.should == 2

      avg_d = @item.avg_diag
      avg_d.is_a?(Diagram).should be true
      avg_d.values.should == [0,1.5,3,4.5,6]
      avg_d.item.should == @item

    end

    it "deals with nil values" do 
      d1 = Diagram.new(
        values: [1,nil,2,3],
        author: @user,
      )
      d2 = Diagram.new(
        values: [nil,nil,4,5],
        author: @user,
      )

      @item.diagrams << d1
      @item.diagrams << d2
      @item.save
      @item.reload

      avg_d = @item.avg_diag
      avg_d.values.should == [ 1, 50, 3, 4 ]
    end
  end
  #}}}

  #{{{ skills 
  describe :skills do 
    it 'lists skills' do 
      t1 =Tag.new(name: :hahaha, category: "skill")
      t2 =Tag.new(name: :hohoho, category: "skill")
      @item.tags << t1
      @item.tags << t2

      expect(@item.skills.to_a).to match_array( [t1,t2])
    end
  end
  #}}}

  #{{{ user_reco_score
  describe :user_recommandations do 

    it "should default to 0 " do 
      expect(@item.user_reco_score(@user)).to eq 0
    end

    it "scores 1 when unrecommand" do 
      @item.unrecommenders << @user
      expect(@item.user_reco_score(@user)).to eq 1
    end
    
    it "scores 2 when norecommand" do 
      @item.norecommenders << @user
      expect(@item.user_reco_score(@user)).to eq 2
    end

    it "scores 3 when recommands" do 
      @item.recommenders << @user
      expect(@item.user_reco_score(@user)).to eq 3
    end

    it "scores 4 when loves" do 
      @item.lovers << @user
      expect(@item.user_reco_score(@user)).to eq 4
    end
  end
  #}}}

end
