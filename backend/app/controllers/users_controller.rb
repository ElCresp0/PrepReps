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
end
