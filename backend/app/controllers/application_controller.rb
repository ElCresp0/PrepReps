# app/controllers/application_controller.rb
# based on: https://oneuptime.com/blog/post/2026-01-26-ruby-rails-rest-api/view
class ApplicationController < ActionController::API
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

    # helper_method :current_user
    attr_reader :current_user

    private
    # Authenticate user from Authorization header
    def authenticate_request
        @current_user = authorize_request
    end

    def authorize_request
        header = request.headers["Authorization"]
        raise ExceptionHandler::AuthenticationError, "Missing token" unless header

        token = header.split(" ").last
        decoded = JsonWebToken.decode(token)
        User.find(decoded[:user_id])
    end

    def handle_record_not_found(e)
        # TODO: migrate rescues to ./concerns?
        render json: { message: "User not found" }, status: :not_found
    end
end
