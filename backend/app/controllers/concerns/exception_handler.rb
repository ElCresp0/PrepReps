# app/controllers/concerns/exception_handler.rb
# based on <https://oneuptime.com/blog/post/2026-01-26-ruby-rails-rest-api/view#jwt-authentication>

module ExceptionHandler
  extend ActiveSupport::Concern

  # Custom exception classes
  class AuthenticationError < StandardError; end
  class ExpiredToken < StandardError; end
  class InvalidToken < StandardError; end

  included do
    # Handle all exceptions with appropriate responses
    rescue_from StandardError, with: :handle_standard_error
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
    rescue_from ExceptionHandler::AuthenticationError, with: :handle_unauthorized
    rescue_from ExceptionHandler::ExpiredToken, with: :handle_unauthorized
    rescue_from ExceptionHandler::InvalidToken, with: :handle_unauthorized
  end

  private

  def handle_standard_error(exception)
    # Log the error for debugging
    Rails.logger.error("Unhandled error: #{exception.message}")
    Rails.logger.error(Array(exception.backtrace).first(10).join("\n"))

    render json: {
      error: {
        code: "internal_error",
        message: Rails.env.production? ? "An unexpected error occurred" : exception.message
      }
    }, status: :internal_server_error
  end

  def handle_not_found(exception)
    render json: {
      error: {
        code: "not_found",
        message: "Resource not found: #{exception.message}"
      }
    }, status: :not_found
  end

  def handle_validation_error(exception)
    render json: {
      error: {
        code: "validation_failed",
        message: "Validation failed",
        details: exception.record.errors.messages
      }
    }, status: :unprocessable_entity
  end

  def handle_parameter_missing(exception)
    render json: {
      error: {
        code: "missing_parameter",
        message: exception.message
      }
    }, status: :bad_request
  end

  def handle_unauthorized(exception)
    render json: {
      error: {
        code: "unauthorized",
        message: exception.message
      }
    }, status: :unauthorized
  end
end
