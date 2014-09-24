class SignupPermission
  include Mongoid::Document

  field :email, type: String

  field :school_names, type: Array

  field :firstname, type: String
  field :lastname, type: String

  validates_presence_of :school_names
  validates_presence_of :email

  validates_uniqueness_of :email

  after_create :send_email

  def pretty_id
    id.to_s
  end

  protected
  def send_email
    SignupPermissionMailer.send_user_email(email, school_names).deliver
  end

end
