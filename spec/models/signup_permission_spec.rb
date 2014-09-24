require 'spec_helper'

describe SignupPermission do
  before(:each) do 
    SignupPermission.delete_all
  end

  describe :email_send_after_creation do 

    it "sends email at creation" do 
      s = FactoryGirl.build(:signup_permission)
      expect(s.valid?).to be true

      # send an email at creation
      expect{s.save}.to change {ActionMailer::Base.deliveries.count}.by(1)

      # don't send an email each time the model is saved
      expect{s.save}.to change {ActionMailer::Base.deliveries.count}.by(0)
    end

  end

end
