Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # /applicants/:applicant_id/applications/:id
  resources :applicants do
    resources :applications
  end

  resources :applications, only: [:index, :show]
  
  @home = "hello_react"
  
  get "/#{@home}", to: "#{@home}#index"
  get "/#{@home}#courses", to: "#{@home}#courses"
  get "/#{@home}#applicantsbycourse", to: "#{@home}#applicantsbycourse"
  get "/#{@home}#assigned", to: "#{@home}#assigned"
  get "/#{@home}#unassigned", to: "#{@home}#unassigned"
  get "/#{@home}#summary", to: "#{@home}#summary"

  get "/#{@home}#applicant:id", to: "#{@home}#applicant"
end
