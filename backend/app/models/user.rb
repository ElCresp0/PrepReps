class User < ApplicationRecord
    has_secure_password

    # validations
    validates :name, presence: true, uniqueness: true, length: { minimum: 2, maximum: 100 }
    validates :password, length: { minimum: 8 }, if: -> { new_record? || !password.nil? }
end
