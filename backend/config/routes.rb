Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Authentication
  post "/auth/sign_up" => "users#sign_up"
  post "/auth/sign_in" => "auth#sign_in"

  # Users
  # get users
  get "/users" => "users#index"
  get "/profile" => "users#profile"
  delete "/users" => "users#destroy"

  # Puzzles
  get "/puzzles" => "puzzles#index"
  post "/puzzles" => "puzzles#create"

  # Defines the root path route ("/")
  # root "posts#index"
end
