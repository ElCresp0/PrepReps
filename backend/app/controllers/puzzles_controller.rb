# app/controllers/puzzles_controller.rb
# based on <https://oneuptime.com/blog/post/2026-01-26-ruby-rails-rest-api/view#tasks-controller>

class PuzzlesController < ApplicationController
    before_action :authenticate_request
    rescue_from ActiveRecord::RecordNotUnique, with: :handle_duplicate_puzzle

    # GET /puzzles
    def index
        # TODO: add pagination
        @puzzles = current_user.puzzles
        render json: {
            puzzles: @puzzles.map { |puzzle| PuzzleSerializer.new(puzzle).as_json }
        }
    end

    def get_puzzle_by_id
        puzzle = current_user.puzzles.find_by!(id: puzzles_params[:puzzle_id])
        render json: PuzzleSerializer.new(puzzle).as_json, status: :ok
    end

    # POST /puzzles
    def create
        puzzle = current_user.puzzles.create!(puzzles_params)

        render json: {
            Puzzle: PuzzleSerializer.new(puzzle).as_json
        }, status: :created
    end

    def update
        puzzle = current_user.puzzles.find_by!(id: puzzles_params[:puzzle_id])
        puzzle.update(
            title: puzzles_params[:title] || puzzle[:title],
            pgn: puzzles_params[:pgn] || puzzle[:pgn]
        )

        render json: PuzzleSerializer.new(puzzle).as_json, status: :ok
    end

    # DELETE /puzzles
    def delete
        puzzle = current_user.puzzles.find_by!(id: puzzles_params[:puzzle_id])
        current_user.puzzles.destroy(puzzles_params[:puzzle_id])

        render json: {}, status: :ok
    end

    private

    def puzzles_params
        params.permit(:title, :pgn, :puzzle_id)
    end

    def handle_duplicate_puzzle(e)
        render json: { message: "Puzzle with this title already exists" }, status: :conflict
    end
end
