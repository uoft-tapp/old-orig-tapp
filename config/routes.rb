Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/hello_react", to: "hello_react#index"

  # /applicants/:applicant_id/applications/:id
  resources :applicants do
    resources :assignments
    resources :applications
  end
  resources :assignments, only: [:index, :show]
  resources :applications, only: [:index, :show]
  resources :positions
end
