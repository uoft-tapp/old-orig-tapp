Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # /applicants/:applicant_id/applications/:id
  resources :applicants do
    resources :applications
  end

  resources :applications, only: [:index, :show]
  
  get "/index.html", to: "app#main"

end
