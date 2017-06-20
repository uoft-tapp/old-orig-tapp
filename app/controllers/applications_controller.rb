class ApplicationsController < ApplicationController
  # td: figure out if front-end wants the list of preferences for each application
  def index
    # present? - checks if the applicant_id is present in the request
    @applications = if params[:applicant_id].present?
      # Since Applicants are associated to applications
      Applicant.find(params[:applicant_id]).applications
    else
      Application.all
    end

    render json: @applications.to_json
  end

  def show
    if params[:applicant_id].present?
      # it's redundant if this also looks for the application based on ID
      head :no_content
    else
      @application = Application.includes(:preferences).find(params[:id])
      # convert preferences into json - since we did the grunt work before this will be easy -
      render json: @application.to_json(include: [:preferences])
    end
  end

end
