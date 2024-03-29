require 'spec_helper'

describe Tag do
  before(:each) do 
    Tag.delete_all
    Item.delete_all

    @t1 = FactoryGirl.build(:tag) ; @t1.name = "t1" ; @t1.save
    @t2 = FactoryGirl.build(:tag) ; @t2.name = "t2" ; @t2.save

    @i1 = FactoryGirl.create(:item) ; @i1.tags << @t1 ; @i1.save
    @i2 = FactoryGirl.create(:item) ; @i2.tags << @t2 ; @i2.save
  end

  describe "validations" do 

    it "factory tag should be valid" do 
      Tag.delete_all
      expect(FactoryGirl.build(:tag).valid?).to be true
    end

    #{{{ signup_funnel
    describe :signup_funnel do 
      before do 
        @tag = FactoryGirl.build(:tag)
        @signup = [
          {name: "first", tag_ids: Tag.all.sample(2).map(&:id).map(&:to_s)},
          {name: "second", tag_ids: Tag.all.sample(2).map(&:id).map(&:to_s)},
        ]
      end

      it "validates proper structure" do 
        @tag.signup_funnel = @signup
        @tag.valid?
        @tag.valid?.should be true
      end

      it "can be nil" do 
        @tag.signup_funnel = @signup
        @tag.signup_funnel = nil
        @tag.valid?.should be true
      end

      it "all list elements should be hashes" do 
        @tag.signup_funnel = @signup
        @tag.signup_funnel << "foo"
        @tag.valid?.should be false
      end

      it "all hashes in element should have name key" do 
        @tag.signup_funnel = @signup
        @tag.signup_funnel.last.delete(:name)
        @tag.valid?.should be false
      end

      it "all hashes in element should have tag_ids key" do 
        @tag.signup_funnel = @signup
        @tag.signup_funnel.last.delete(:tag_ids)
        @tag.valid?.should be false
      end

    end
    #}}}

    #{{{ default category
    describe :default_category do 
      it "new tag should have default category other" do 
        t = Tag.new(name: "choice") ; t.save
        t.reload
        expect(t.category).to eq "other"
      end
    end
    #}}}

    #{{{ name/type uniqueness
    describe :name_uniqueness do 
      before do 
        @t3 = Tag.new(name: "haha", category: "choice") 
        @t3.save
      end

      it "allows same name with different categories" do 
        @t4 = Tag.new(name: "haha", category: "admin")
        expect(@t4.valid?).to be true
      end

      it "does NOT allow same name with same categorie" do 
        @t4 = Tag.new(name: "haha", category: "choice")
        expect(@t4.valid?).to be false
      end

    end
    #}}}

  end

  describe "class methods" do

    #{{{ merge tags
    describe "merge tags" do 
      it "should merge tags" do 
        @i1.tags.should == [@t1]
        @i2.tags.should == [@t2]

        @t1.items.should == [@i1]
        @t2.items.should == [@i2]

        (@t1 == @t2).should be false

        Tag.merge!(@t1,@t2)

        @t1.reload
        @i1.reload
        @i2.reload

        # tag has items
        @t1.items.map(&:id).should =~ [@i1,@i2].map(&:id)

        # items have tag
        @i1.tags.should == [@t1]
        @i2.tags.should == [@t1]

        Tag.where(name: @t1.name).count.should == 1
        Tag.where(name: @t2.name).count.should == 0
      end
    end
    #}}}



  end


end
