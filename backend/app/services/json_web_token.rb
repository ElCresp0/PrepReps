# app/services/json_web_token.rb
# based on: https://oneuptime.com/blog/post/2026-01-26-ruby-rails-rest-api/view

class JsonWebToken
  # Use Rails secret key for signing tokens
  SECRET_KEY = Rails.application.credentials.secret_key_base.to_s

  class << self
    # Encode payload with expiration time
    def encode(payload, exp = 24.hours.from_now)
      Rails.logger.debug("JWT encode called")
      payload[:exp] = exp.to_i
      JWT.encode(payload, SECRET_KEY, 'HS256')
    end

    # Decode and verify token
    def decode(token)
      Rails.logger.debug("decoding #{token}")
      decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      HashWithIndifferentAccess.new(decoded.first)
    rescue JWT::ExpiredSignature
      raise ExceptionHandler::ExpiredToken, 'Token has expired'
    rescue JWT::DecodeError
      raise ExceptionHandler::InvalidToken, 'Invalid token'
    end
  end
end