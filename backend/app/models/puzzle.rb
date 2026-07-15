class Puzzle < ApplicationRecord
  belongs_to :user

    # validations
    validates :title, presence: true,
        length: { minimum: 3, maximum: 200 }

    validates :pgn, presence: true
end
