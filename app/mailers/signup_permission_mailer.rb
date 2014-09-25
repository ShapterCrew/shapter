class SignupPermissionMailer < ActionMailer::Base
  default from: "team@shapter.com"

  def send_user_email(email,school_names)
    @user_email = email
    @schools = school_names.join(", ")
    mail(
      to: email,
      subject: "Invitation sur Shapter",
    )
  end


end
