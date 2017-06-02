Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/hello_react", to: "hello_react#index"
  get "/courses", to: "courses#read_json"
end
