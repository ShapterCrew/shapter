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


end
