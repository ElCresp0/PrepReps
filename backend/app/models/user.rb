class User < ApplicationRecord

    has_secure_password

    # Associations
    has_many :puzzles, dependent: :destroy

    validates :name, presence: true,
        uniqueness: { case_sensitive: false },
        length: { minimum: 1, maximum: 16 }

end
