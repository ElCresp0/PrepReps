require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest

  setup do
    post "/auth/sign_up", params: { name: "existing_user", password: "password" }, as: :json
  end

  # sign_up
  test "should create a user" do
    assert_difference("User.count") do
      post "/auth/sign_up", params: { name: "new_user", password: "password" }, as: :json
    end
    assert_response :created

  end

  test "should fail to create a user" do
    assert_no_difference("User.count") do
      post "/auth/sign_up", params: { name: "existing_user", password: "password" }, as: :json
    end
    assert_response :conflict
    
  end

  # sign_in
  test "should retrieve an auth token" do
    post "/auth/sign_in", params: { name: "existing_user", password: "password" }, as: :json

    assert_response :accepted

    data = JSON.parse(response.body)
    assert data.key?("token")
    
  end

  # sign_in with wrong username
  test "should fail to retrieve an auth token (wrong username)" do
    post "/auth/sign_in", params: { name: "nonexistent_user", password: "password" }, as: :json

    assert_response :not_found
    
  end

  # sign_in with wrong password
  test "should fail to retrieve an auth token (wrong password)" do
    post "/auth/sign_in", params: { name: "existing_user", password: "wrong_password" }, as: :json

    assert_response :unauthorized
    
  end

end
