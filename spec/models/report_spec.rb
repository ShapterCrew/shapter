require 'spec_helper'

describe Report do
  before(:each) do 
    Report.delete_all
    User.delete_all
  end

end
