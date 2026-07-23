# app/controllers/auth_controller.rb
# based on <https://dev.to/mohhossain/a-complete-guide-to-rails-authentication-using-jwt-403p>

class AuthController < ApplicationController
    # skip_before_action :authorized, only: [:login]
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

    # POST /auth/sign_in
    def sign_in
        @user = User.find_by!(name: login_params[:name])
        if @user.authenticate(login_params[:password])
            @token = JsonWebToken.encode(user_id: @user.id)
            render json: {
                user: UserSerializer.new(@user).as_json,
                token: @token
            }, status: :accepted
        else
            render json: { message: "Incorrect password" }, status: :unauthorized
        end
    end

    # POST /auth/sign_up
    def sign_up
        @userExists = User.exists?(name: user_params[:name])
        if @userExists
        render json: {
            message: "User with this name already exists",
        }, status: :conflict
        return
        else
        logger.debug "user exists check: negative"
        end

        @user = User.new(user_params)

        if @user.save
        token = JsonWebToken.encode(user_id: @user.id)
        render json: {
            message: "Account created",
            user: UserSerializer.new(@user).as_json,
            token: token
        }, status: :created
        else
        render json: @user.errors, status: :unprocessable_content
        end
    end

    private

    def login_params
        params.permit(:name, :password)
      # bcrypt handles password encryption as described in <https://dev.to/mohhossain/a-complete-guide-to-rails-authentication-using-jwt-403p>
    end

    def user_params
        params.permit(:name, :password)
    end

    def handle_record_not_found(e)
        render json: { message: "User not found" }, status: :not_found
    end
end
