class UsersController < ApplicationController
  before_action :authenticate_request, only: [ :profile, :destroy ]

  # GET /users
  def index
    @users = User.all
    render json: {
        users: @users.map { |user| UserSerializer.new(user).as_json }
    }
  end

  # GET /profile
  def profile
    render json: UserSerializer.new(current_user).as_json
  end

  # POST /auth/sign_up
  def sign_up
    # TODO: migrate this method to auth_controller
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

  # TODO: implement remaining CRUD operations

  # PATCH/PUT /users/1
  # def update
  #   if @user.update(user_params)
  #     render json: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_content
  #   end
  # end

  # DELETE /users
  def destroy
    current_user.destroy!
  end

  private
    def user_params
        params.permit(:name, :password)
      # bcrypt handles password encryption as described in <https://dev.to/mohhossain/a-complete-guide-to-rails-authentication-using-jwt-403p>
    end
end
