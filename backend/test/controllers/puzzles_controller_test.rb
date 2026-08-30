require "test_helper"

class PuzzlesControllerTest < ActionDispatch::IntegrationTest
  setup do
    # sign in as existing_user
    post "/auth/sign_in", params: { name: "existing_user", password: "password" }, as: :json
    data = JSON.parse(response.body)
    @token = data["token"]
  end

  # get puzzles
  test "should fetch all puzzles (def in fixtures)" do
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

  # get one puzzle by id
  test "should get one puzzle" do
    first_puzzle = puzzles[0]
    puzzle_id = first_puzzle["id"]
    puzzle_title = first_puzzle["title"]

    get "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, as: :json

    assert_response :ok

    data = JSON.parse(response.body)
    assert data["id"] == puzzle_id
    assert data["title"] == puzzle_title
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

  # update a puzzle title (success)
  test "should update title and pgn of the first puzzle" do
    first_puzzle = puzzles[0]
    puzzle_id = first_puzzle["id"]
    puzzle_title = first_puzzle["title"]
    puzzle_pgn = first_puzzle["pgn"]
    new_puzzle_title = puzzle_title + "_UPDATED"
    new_puzzle_pgn = puzzle_pgn + "\n\n"

    patch "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, params: { title: new_puzzle_title, pgn: new_puzzle_pgn }, as: :json
    
    assert_response :ok
    data = JSON.parse(response.body)
    assert data["id"] == puzzle_id
    assert data["title"] == new_puzzle_title
    assert data["pgn"] == new_puzzle_pgn

    get "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, as: :json

    assert_response :ok
    data = JSON.parse(response.body)
    assert data["id"] == puzzle_id
    assert data["title"] == new_puzzle_title
    assert data["pgn"] == new_puzzle_pgn

  end
  
  # update a puzzle (unauthorized)
  test "shouldn't update title and pgn of the first puzzle (unauthorized)" do
    first_puzzle = puzzles[0]
    puzzle_id = first_puzzle["id"]
    original_puzzle_title = first_puzzle["title"]
    original_puzzle_pgn = first_puzzle["pgn"]
    new_puzzle_title = original_puzzle_title + "_UPDATED"
    new_puzzle_pgn = original_puzzle_pgn + "\n\n"

    patch "/puzzles/#{puzzle_id}", params: { title: new_puzzle_title, pgn: new_puzzle_pgn }, as: :json
    
    assert_response :unauthorized

    # no changes expected
    get "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, as: :json

    assert_response :ok
    data = JSON.parse(response.body)
    assert data["id"] == puzzle_id
    assert data["title"] == original_puzzle_title
    assert data["pgn"] == original_puzzle_pgn
  end

  # update a puzzle title (duplicate title)
  test "shouldn't update title and pgn of the first puzzle (duplicate title)" do
    first_puzzle = puzzles[0]
    second_puzzle = puzzles[1]

    puzzle_id = first_puzzle["id"]
    original_puzzle_title = first_puzzle["title"]
    original_puzzle_pgn = first_puzzle["pgn"]
    new_puzzle_title = second_puzzle["title"]
    new_puzzle_pgn = original_puzzle_pgn + "\n\n"

    patch "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, params: { title: new_puzzle_title, pgn: new_puzzle_pgn }, as: :json
    
    assert_response :conflict

    # no changes expected
    get "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, as: :json

    assert_response :ok
    data = JSON.parse(response.body)
    assert data["id"] == puzzle_id
    assert data["title"] == original_puzzle_title
    assert data["pgn"] == original_puzzle_pgn
  end

  # update a puzzle title (puzzle not found)
  test "shouldn't update title and pgn of the first puzzle (puzzle not found)" do
    first_puzzle = puzzles[0]

    puzzle_id = 2
    while (puzzles.any? { |puzzle| puzzle["id"] == puzzle_id} ) do
      puzzle_id **= 2
    end

    original_puzzle_title = first_puzzle["title"]
    original_puzzle_pgn = first_puzzle["pgn"]
    new_puzzle_title = original_puzzle_title + "_UPDATED"
    new_puzzle_pgn = original_puzzle_pgn + "\n\n"

    patch "/puzzles/#{puzzle_id}", headers: { Authorization: "Bearer #{@token}" }, params: { title: new_puzzle_title, pgn: new_puzzle_pgn }, as: :json
    
    assert_response :not_found
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
