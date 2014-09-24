class SignupPermission < ActionMailer::Base
  default from: "from@example.com"

  def send_user_email(user)
    @user_email = user.email
    @schools = user.schools.map(&:name).join(", ")
  end


end
