Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # /applicants/:applicant_id/applications/:id
  resources :applicants do
    resources :assignments
    resources :applications, only: [:index]
  end
  resources :assignments, only: [:index, :show]
  resources :applications, only: [:index, :show]
  resources :positions
  resources :instructors
  
  get "/index.html/(*z)", to: "app#main"
end
