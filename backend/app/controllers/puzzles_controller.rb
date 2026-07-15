# app/controllers/puzzles_controller.rb
# based on <https://oneuptime.com/blog/post/2026-01-26-ruby-rails-rest-api/view#tasks-controller>

class PuzzlesController < ApplicationController
    before_action :authenticate_request
   
    # GET /puzzles
    def index
        # TODO: add pagination
        @puzzles = current_user.puzzles
        render json: {
            puzzles: @puzzles.map { |puzzle| PuzzleSerializer.new(puzzle).as_json }
        }
    end

    # POST /puzzles
    def create
        puzzle = current_user.puzzles.create!(puzzles_params)

        render json: {
            Puzzle: PuzzleSerializer.new(puzzle).as_json
        }, status: :created
    end

  private

    def puzzles_params
        params.permit(:title, :pgn)
    end

end
