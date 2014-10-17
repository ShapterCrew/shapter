require 'spec_helper'

describe ProfileBoxInternship do

  before(:each) do 
    User.delete_all
    Internship.delete_all
    Item.delete_all
    Tag.delete_all
    ProfileBox.delete_all

    @u = FactoryGirl.create(:user)

    @i = FactoryGirl.build(:internship)
    @i.tags << (@t = Tag.create(name: "tname", category: "type"))
    @i.trainees = [@u]
    @i.save

    @pb = FactoryGirl.build(:profile_box_internship)
    @pb.internship = @i

    @pb.instance_eval{set_tag_ids}
  end

  describe :tags do 
    it "shows tags of category 'type' from internship" do 
      expect(@pb.tag_ids).to match_array([@t.id])
      expect(@pb.tags).to match_array([@t])
    end
  end

end
