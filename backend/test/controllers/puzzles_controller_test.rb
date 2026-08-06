require "test_helper"

class PuzzlesControllerTest < ActionDispatch::IntegrationTest
  setup do
    # sign in as existing_user
    post "/auth/sign_in", params: { name: "existing_user", password: "password" }, as: :json
    data = JSON.parse(response.body)
    @token = data["token"]
  end

  # get puzzles
  test "should fetch one puzzle" do
    # as defined in puzzles.yml fixture
    get "/puzzles", headers: { Authorization: "Bearer #{@token}" }, as: :json

    assert_response :ok

    data = JSON.parse(response.body)
    assert data["puzzles"].length == puzzles.length

  end

  # get puzzles unauthorized (no token)
  test "should restrict access for unauthorized users (no token)" do
    get "/puzzles", headers: { Authorization: "Bearer InvalidTokenValue" }, as: :json

    assert_response :unauthorized

  end

  # get puzzles unauthorized (invalid token)
  test "should restrict access for unauthorized users (invalid token)" do
    get "/puzzles", as: :json

    assert_response :unauthorized

  end

  # post a puzzle
  test "should create a puzzle" do
    assert_difference("Puzzle.count") do
      post "/puzzles", headers: { Authorization: "Bearer #{@token}" }, params: { title: "new puzzle", pgn: "1. c4 g6" }, as: :json
    end
    assert_response :created
  end

  # post a puzzle with a duplicate title
  test "should fail to create a puzzle (duplicate title)" do
    assert_no_difference("Puzzle.count") do
      post "/puzzles", headers: { Authorization: "Bearer #{@token}" }, params: { title: "existing title", pgn: "1. c4 g6" }, as: :json
    end
    assert_response :conflict
  end

  # delete a puzzle
  test "should delete the first puzzle" do
    get "/puzzles", headers: { Authorization: "Bearer #{@token}" }, as: :json
    assert_response :ok
    data = JSON.parse(response.body)
    puzzle_id = data["puzzles"][0]["id"]
    puzzles_count = data["puzzles"].length

    delete "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, as: :json
    assert_response :ok

    get "/puzzles", headers: { Authorization: "Bearer #{@token}" }, as: :json
    assert_response :ok
    data = JSON.parse(response.body)
    puzzles_count_after_delete = data["puzzles"].length

    assert puzzles_count_after_delete == puzzles_count - 1
  end

end
