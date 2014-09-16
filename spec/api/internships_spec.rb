require "spec_helper"
describe Shapter::V7::SchoolsDiagDims do 

  before(:each) do 
    User.delete_all
    Internship.delete_all
    Tag.delete_all

    @user = FactoryGirl.create(:user)
    User.any_instance.stub(:confirmed_student?).and_return(true)
    login(@user)

    @intern = FactoryGirl.create(:internship)
    @intern2= FactoryGirl.create(:internship)

    @intern.trainee = @user
    @intern2.trainee = @user

    @t1 = Tag.new(name: :t1) ; @t1.save
    @t2 = Tag.new(name: :t2) ; @t2.save
    @t3 = Tag.new(name: :t3) ; @t3.save

    @intern.tags << @t1 ; @intern.tags << @t2
    @intern2.tags << @t1; @intern2.tags << @t3
    @intern.save
    @intern2.save

    @intern.reload
    @intern2.reload
  end

  #{{{ create
  describe :create do
    before do 
      @t = Tag.create(name: "Honolulu", category: "geo")
      @myparams = {
        title: (@title = 'my fancy internship'),
        start_date: (@start_date = Date.today),
        end_date: (@end_date = Date.today + 3),
        location: {
          formatted_address: "haha",
          lat: 2.35,
          lng: 48.85,
        },
        tags_by_ids: [@t.id],
        tags_by_name_cat: (@tags = [
          {tag_name: "Dauphine", tag_category: "school"},
          {tag_name: "dresseur", tag_category: "position"},
        ]),
      }

    end

    it "should create with proper attributes" do 
      Internship.delete_all
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

  #{{{ update
  describe :update do 
    it "should update" do 
      title = "montitre"
      expect(@intern.title).to_not eq title
      put "internships/#{@intern.id}", {title: title}
      @intern.reload
      expect(@intern.title).to eq title
    end
  end
  #}}}

  # {{{ filter
  describe :filter do 

    context "when logged in" do 
      before do 
        login(@user)
      end
      it "should filter properly" do 
        @intern.update_attributes(start_date: Date.yesterday, end_date: Date.tomorrow) # en cours
        @intern2.update_attributes(start_date: Date.today + 3, end_date: Date.today + 5) # dans le futur

        post "internships/filter", {filter: [@t1.id.to_s]}
        a = JSON.parse(response.body)
        a["internships"].map{|h| h["id"]}.should =~ [@intern.id, @intern2.id].map(&:to_s)

        post "internships/filter", {filter: [@t1.id.to_s], active_only: true}
        a = JSON.parse(response.body)
        a["internships"].map{|h| h["id"]}.should =~ [@intern.id].map(&:to_s)

        post "internships/filter", {filter: [@t1.id.to_s,@t3.id.to_s]}
        a = JSON.parse(response.body)
        a["internships"].map{|h| h["id"]}.should =~ [@intern2.id].map(&:to_s)

        post "internships/filter", {filter: [@t1.id.to_s,"hahahalol"]}
        a = JSON.parse(response.body)
        a["internships"].blank?.should be true
      end

    end
  end
  #}}}

  #{{{ destroy
  describe :destroy do 
    before do 
      @u2 = FactoryGirl.build(:user) 
      @u2.email="another.email@test.com" 
      @intern.trainee = @u2
      @u2.save ; @intern.save
      @u2.stub(:confirmed_student?).and_return(true)
    end

    context "when admin" do 
      before do 
        User.any_instance.stub(:shapter_admin).and_return(true)
      end
      it "destroys" do 
        id = @intern.id.dup
        expect(Internship.where(id: id).any?).to be true
        delete "internships/#{@intern.id}"
        expect(Internship.where(id: id).any?).to be false
      end
    end

    context "when author" do 
      before do 
        @intern.trainee = @user ; @intern.save
      end
      it "destroys" do 
        id = @intern.id.dup
        expect(Internship.where(id: id).any?).to be true
        delete "internships/#{@intern.id}"
        expect(Internship.where(id: id).any?).to be false
      end
    end

    context "when nothing" do 
      it "does NOT destroys" do 
        id = @intern.id.dup
        expect(Internship.where(id: id).any?).to be true
        delete "internships/#{@intern.id}"
        expect(Internship.where(id: id).any?).to be true
      end
    end

  end
  #}}}

  #{{{ add_tags
  describe :add_tags do
    it "adds tags" do 
      @new_t = Tag.create(category: "skill", name: "hahaha new skill")
      @p = {
        tags_by_name_cat: [
          {tag_name: "new_tag1", tag_category: "geo"},
        ],
        tags_by_ids: [@new_t.id.to_s],
      }

      put "internships/#{@intern.id}/tags", @p
      @intern.reload
      expect(@intern.tags.include?(@new_t)).to be true
      expect(@intern.tags.map(&:name).include?("new_tag1")).to be true
    end
  end
  #}}}

  #{{{ remove_tags
  describe :remove_tags do 
    it "removes tags" do 
      User.any_instance.stub(:shapter_admin).and_return(true)

      @p = {
        tags_by_ids: [@t1.id.to_s],
        tags_by_name_cat: [
          {tag_name: @t2.name, tag_category: @t2.category}
        ]
      }

      expect(@intern.tag_ids.include?(@t1.id)).to be true
      expect(@intern.tag_ids.include?(@t2.id)).to be true

      delete "internships/#{@intern.id}/tags", @p
      @intern.reload
      expect(@intern.tag_ids.include?(@t1.id)).to be false
      expect(@intern.tag_ids.include?(@t2.id)).to be true
    end
  end
  #}}}

end

