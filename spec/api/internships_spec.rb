require "spec_helper"
describe Shapter::V7::SchoolsDiagDims do 

  before(:each) do 
    User.delete_all
    Internship.delete_all
    Tag.delete_all

    @user = FactoryGirl.create(:user)
    User.any_instance.stub(:confirmed_student?).and_return(true)
    login(@user)
  end

  #{{{ create
  describe :create do
    before do 
      @t = Tag.create(name: "Honolulu", category: "geo")
      @myparams = {
        title: (@title = 'my fancy internship'),
        start_date: (@start_date = Date.today),
        end_date: (@end_date = Date.today + 3),
        tags_by_ids: [@t.id],
        tags_by_name_cat: (@tags = [
          {tag_name: "Dauphine", tag_category: "school"},
          {tag_name: "dresseur", tag_category: "job"},
        ]),
      }

    end

    it "should create with proper attributes" do 
      expect(Internship.count).to eq 0
      post "/internships/create" , @myparams 
      expect(Internship.count).to eq 1
      i = Internship.last
      expect(i.title).to eq @title
      expect(i.start_date).to eq @start_date
      expect(i.end_date).to eq @end_date
      expect(i.tags.map(&:name)).to match_array(@tags.map{|h| h[:tag_name]} + [@t.name])
      expect(i.tags.map(&:category)).to match_array(@tags.map{|h| h[:tag_category]} + [@t.category])

    end

  end
  #}}}

end

