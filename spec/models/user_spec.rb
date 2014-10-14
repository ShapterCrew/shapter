require 'spec_helper'

describe User do
  before(:each) do 
    User.delete_all
    Item.delete_all
    Tag.delete_all
    SignupPermission.delete_all
    Internship.delete_all
    ProfileBox.delete_all
  end

  #{{{ skills
  describe :skills do 
    it 'list skills' do 
      i1 = FactoryGirl.create(:item)
      i2 = FactoryGirl.create(:item)
      i3 = FactoryGirl.create(:item)

      in1 = FactoryGirl.create(:internship)

      t1 = Tag.new(name: "peinture sur cul", category: :skill)
      t2 = Tag.new(name: "pilotage de caddie", category: :skill)
      t3 = Tag.new(name: "chant", category: :skill)


      i1.tags << t1
      i2.tags << t2
      i3.tags << t2

      in1.tags << t2
      in1.tags << t3

      u = User.new(item_ids: [i1,i2,i3].map(&:id), internship_ids: [in1.id])

      expect(u.skills).to match_array([
                                      {
        tag_id: t1.id,
        name: t1.name,
        power: 1,
        internship_consolidated: false,
      },
      {
        tag_id: t2.id,
        name: t2.name,
        power: 3,
        internship_consolidated: true,
      },
      {
        tag_id: t3.id,
        name: t3.name,
        power: 1,
        internship_consolidated: true,
      },
      ])
    end
  end
  #}}}

  #{{{ profile
  describe :profile do 
    before do 
      @u = FactoryGirl.create(:user)
      @it = FactoryGirl.create(:item)
      @in = FactoryGirl.build(:internship)
      @in.trainees = [@u]
      @in.start_date = Date.today - 10
      @in.end_date = Date.today - 5
      @in.save

      @pb = FactoryGirl.build(:profile_box_item)
      @pb.users = [@u]
      @pb.item_ids = [@it.id]
      @pb.save

      @profile = @u.profile
    end


    it "is sorted by start date" do 
      l = @profile.map(&:start_date)
      expect(l.sort).to eq l
    end

    it "contains both internships and items" do 
      expect(@profile.map(&:type).include?("internship")).to be true
      expect(@profile.map(&:type).include?("items")).to be true
    end

  end
  #}}}

  #{{{ order_profile
  describe :order_profile do 
    it "orders profile" do 
      @user = FactoryGirl.create(:user)
      @pb1 = FactoryGirl.build(:profile_box_item)
      @pb1.name = "pb1"
      @internship = FactoryGirl.build(:internship)
      @pb2 = FactoryGirl.build(:profile_box_item)

      @i1 = FactoryGirl.create(:item)
      @i2 = FactoryGirl.create(:item)
      @pb1.add_item!(@i1)
      @pb2.add_item!(@i2)

      @pb1.users << @user
      @pb2.users << @user
      @internship.trainees << @user

      @pb2.start_date        = Date.today
      @internship.start_date = Date.today + 1
      @pb1.start_date        = Date.today + 2

      @pb2.end_date        = Date.today + 5
      @internship.end_date = Date.today + 5
      @pb1.end_date        = Date.today + 5

      @pb1.save
      @pb2.save
      @internship.save

      expect(@pb1.valid?).to be true
      expect(@pb2.valid?).to be true
      expect(@internship.valid?).to be true

      #byebug

      @user.order_profile!

      pb1 = @user.profile.select{|p| p.is_a? ProfileBoxItem}.select{|p| p.item_ids == [@i1.id] rescue nil}.first
      pb2 = @user.profile.select{|p| p.is_a? ProfileBoxItem}.select{|p| p.item_ids == [@i2.id] rescue nil}.first
      pb_int = @user.profile.select{|p|p.is_a? ProfileBoxInternship}.select{|p| p.internship_id == @internship.id rescue nil}.first

      #pb1.reload
      #pb2.reload
      #pb_int.reload

      expect(pb2.next_1_id).to eq pb_int.id
      expect(pb_int.next_1_id).to eq pb1.id
      expect(pb1.next_1_id.nil?).to be true

      expect(pb1.prev_1_id).to eq pb_int.id
      expect(pb_int.prev_1_id).to eq pb2.id
      expect(pb2.prev_1_id.nil?).to be true

    end
    #{{{ item_reco_score
    describe :item_recommandations do 

      before(:each) do 
        @i = FactoryGirl.create(:item)
        @user = FactoryGirl.create(:user)
      end

      it "should default to 0 " do 
        expect(@user.item_reco_score(@i)).to eq 0
      end

      it "scores 1 when unrecommand" do 
        @user.unrecommended_items << @i
        expect(@user.item_reco_score(@i)).to eq 1
      end

      it "scores 2 when norecommand" do 
        @user.norecommended_items << @i
        expect(@user.item_reco_score(@i)).to eq 2
      end

      it "scores 3 when recommands" do 
        @user.recommended_items << @i
        expect(@user.item_reco_score(@i)).to eq 3
      end
    end
    #}}}

    #{{{ reco_score_item!
    describe :reco_score_item! do 
      before(:each) do 
        @item = FactoryGirl.create(:item)
        @user = FactoryGirl.create(:user)
      end
      it "errors if score > 0" do 
        expect{ @user.reco_score_item!(@item,5) }.to raise_error
      end

      it "scores item properly" do 
        expect{ @user.reco_score_item!(@item,3) }.to change{@user.item_reco_score(@item)}.from(0).to(3)
        expect{ @user.reco_score_item!(@item,1) }.to change{@user.item_reco_score(@item)}.from(3).to(1)
        expect{ @user.reco_score_item!(@item,2) }.to change{@user.item_reco_score(@item)}.from(1).to(2)

        expect(@user.unrecommended_items.empty?).to be true
        expect(@user.norecommended_items.empty?).to be false
        expect(@user.recommended_items.empty?).to be true

        expect(@item.unrecommenders.empty?).to be true
        expect(@item.norecommenders.empty?).to be false
        expect(@item.recommenders.empty?).to be true
      end

    end
    #}}}

  end
end
