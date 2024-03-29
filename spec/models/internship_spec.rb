require 'spec_helper'

describe Internship do

  #{{{ duration
  describe :duration do 
    it "should work" do 
      i = FactoryGirl.build(:internship)
      d = Date.today
      i.stub(:start_date).and_return(d + 3.days)
      i.stub(:end_date).and_return(d + 6.days )
      
      expect(i.duration).to eq 3
    end
  end
  #}}}

  #{{{ validations
  describe :validations do 

    it "factory should validate" do 
      i = FactoryGirl.build(:internship)
      expect(i.valid?).to be true
    end

    it "checks that end date is > start date" do 
      i = FactoryGirl.build(:internship)
      i.start_date = Date.today
      i.end_date = Date.today - 3.days

      expect(i.valid?).to be false
    end
  end
  #}}}

  describe :has_profile_box do 
    before do 
      ProfileBox.any_instance.stub(:valid?).and_return(true)
      Internship.any_instance.stub(:valid?).and_return(true)
    end

    it "new internship creates profile box" do 
      expect{FactoryGirl.create(:internship)}.to change{ProfileBoxInternship.count}.by(1)
    end

    it "destroys profile box after destroy" do 
      FactoryGirl.create(:internship)
      expect{Internship.last.destroy}.to change{ProfileBoxInternship.count}.by(-1)
    end

  end


end
