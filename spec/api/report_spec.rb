require 'spec_helper'

describe Shapter::V7::Comments do 

  before(:each) do 
    CommentReport.delete_all
    User.any_instance.stub(:confirmed?).and_return(true)
    Item.delete_all
    User.delete_all
    @item = FactoryGirl.create(:item)
    @user = FactoryGirl.create(:user)
    @comment = FactoryGirl.build(:comment)
    @comment.author = @user ; @comment.item = @item
    @comment.save

    login(@user)

    @desc = "J'aime pas tes pompes"
  end

  #{{{ report comment
  describe :report_comment do 
    it "should create a CommentReport" do 
      expect(CommentReport.count).to eq 0

      post "items/#{@item.id}/comments/#{@comment.id}/report", description: @desc

      expect(CommentReport.count).to eq 1
      c = CommentReport.last

      expect(c.reporter.id).to eq @user.id
      expect(c.description).to eq @desc
      expect(c.comment).to eq @comment
      
    end
  end
  #}}}


end
