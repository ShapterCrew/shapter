require 'spec_helper'

describe CommentReport do
  before do 
    Item.delete_all
    User.delete_all

    @item = FactoryGirl.create(:item)
    @user = FactoryGirl.create(:user)
    @comment = FactoryGirl.build(:comment) ; @comment.item = @item ; @comment.author = @user ; @comment.save
  end

  describe :mailer_callback do 
    it "should send email at creation" do 
      r = FactoryGirl.build(:comment_report)
      r.reporter = @user
      r.item_id = @item.id
      r.comment_id = @comment.id
      expect(r.valid?).to be true
      expect{r.save}.to change {ActionMailer::Base.deliveries.count}.by(1)
    end
  end

end
