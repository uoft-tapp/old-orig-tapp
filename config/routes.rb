Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # /applicants/:applicant_id/applications/:id
  resources :applicants do
    resources :assignments, except: [:show]
    resources :applications, only: [:index]
  end
  resources :assignments, only: [:index, :show]
  resources :applications, only: [:index, :show]
  resources :positions
  resources :instructors

  get "/index.html/(*z)", to: "app#main"

  get "/export/chass/:round_id", to: "export#chass"
  get "/export/cdf-info", to: "export#cdf"
  get "/export/transcript-access", to: "export#transcript_access"
  get "/export/offers", to: "export#offers"
  post "/import/chass", to: "import#chass"
end
