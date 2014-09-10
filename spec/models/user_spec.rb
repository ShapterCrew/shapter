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

      t1 = Tag.new(name: "peinture sur cul", category: :skill)
      t2 = Tag.new(name: "pilotage de caddie", category: :skill)

      i1.tags << t1
      i2.tags << t2
      i3.tags << t2

      u = User.new(item_ids: [i1,i2,i3].map(&:id))

      expect(u.skills).to match_array([
        {
          tag_id: t1.id,
          name: t1.name,
          power: 1,
        },
        {
          tag_id: t2.id,
          name: t2.name,
          power: 2,
        },
      ])
    end
  end
  #}}}


end
