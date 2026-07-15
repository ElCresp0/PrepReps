# app/controllers/auth_controller.rb
# based on <https://dev.to/mohhossain/a-complete-guide-to-rails-authentication-using-jwt-403p>

class AuthController < ApplicationController

    # skip_before_action :authorized, only: [:login]
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

    # POST /auth/sign_in
    def sign_in
        logger.info "before sign in"
        @user = User.find_by!(name: login_params[:name])
        logger.info "before authenticate"
        if @user.authenticate(login_params[:password])
            logger.info "before encoding"
            @token = JsonWebToken.encode(user_id: @user.id)
            render json: {
                user: UserSerializer.new(@user).as_json,
                token: @token
            }, status: :accepted
        else
            render json: {message: 'Incorrect password'}, status: :unauthorized
        end
    end


    private

    def login_params
        params.permit(:name, :password)
    end

    def handle_record_not_found(e)
        render json: {message: "User not found"}, status: :not_found
    end

end
