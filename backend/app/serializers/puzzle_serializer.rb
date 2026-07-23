# app/serializers/user_serializer.rb
class PuzzleSerializer
  def initialize(puzzle)
    @puzzle = puzzle
  end

  def as_json
    {
      title: @puzzle.title,
      pgn: @puzzle.pgn
    }
  end
end
