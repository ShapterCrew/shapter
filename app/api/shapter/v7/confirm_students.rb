module Shapter
  module V7
    class ConfirmStudents < Grape::API
      format :json

      before do 
        check_confirmed_account!
      end

      namespace :users do 
        namespace :me do 

          #{{{ confirm_open_student
          desc "confirm a student's school, without email validation"
          params do 
            requires :school_id, desc: "if of the school (i.e. id of the tag, that is a school)"
          end
          post :confirm_open_student do
            check_confirmed_account!
            school = Tag.schools.find(params[:school_id]) || error!('school not found',404)
            if school.open_school?
              current_user.schools << school
              if current_user.save
                present current_user, with: Shapter::Entities::User, entity_options: entity_options
              else
                error!(current_user.errors.messages)
              end
            else
              error!("#{school.name} is no open school")
            end
          end
          #}}}

          #{{{ confirm_student
          desc "confirm student with different email address"
          params do 
            optional :email   , type: String, desc: "school email to validate student with"
            optional :password, type: String, desc: "If the email is already recorded in database, then a password will be asked to confirm ownership"
          end
          post :confirm_student_email do 
            email   = params[:email]
            pass    = params[:password]
            schools = User.schools_for(email)

            # End now if email is no student email
            error!("unrecognized student email format") if schools.empty?

            if u = User.find_by(email: email) 
              error!("existing account,please provide a password") if pass.blank?
              error!("wrong email/password combination") unless u.valid_password?(pass)
              error!("current account is valid and won't be deleted") if current_user.confirmed_student?

              # Old account has been found, email gives schools and ownership is verified through password confirmation

              this_user_id = current_user.id.dup

              u.update_attribute(:uid, current_user.uid)
              u.update_attribute(:provider,  current_user.provider)
              u.update_attribute(:facebook_email, current_user.email)
              u.update_attribute(:image, current_user.image)

              User.find(this_user_id).destroy

              present :email, email
              present :status, :changed

            else

              # No account is found using the provided email, and provided email gives schools
              current_user.update_attribute(:email, email)
              current_user.update_attribute(:confirmed_at, nil)
              current_user.save
              current_user.send_confirmation_instructions
              present :email, email
              present :status, "sent confirmation email"

            end

          end
          #}}}

        end
      end

    end
  end
end
