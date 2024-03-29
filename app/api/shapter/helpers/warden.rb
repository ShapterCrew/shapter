module Shapter
  module Helpers
    module Warden
      def pong
        :pong
      end

      def warden
        env['warden']
      end

      def user_signed_in?
        !!warden.user
      end

      def check_user_login!
        error!("please login" ,401) unless user_signed_in?
      end

      def check_user_admin!
        check_user_login!
        error!("forbidden" ,401) unless current_user.shapter_admin
      end

      def check_confirmed_student!
        check_user_login!
        error!("forbidden" ,401) unless current_user.confirmed_student?
      end

      def check_confirmed_account!
        check_user_login!
        error!("please confirm your account" ,401) unless current_user.confirmed_account?
      end

      def current_user
        warden.user
      end

    end
  end
end
