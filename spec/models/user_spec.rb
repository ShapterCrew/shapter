require 'spec_helper'

describe User do
  before(:each) do 
    User.delete_all
    Item.delete_all
    Tag.delete_all
    SignupPermission.delete_all
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
