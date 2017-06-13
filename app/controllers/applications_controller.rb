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
    @application = if params[:applicant_id].present?
      # finds the preferences for each application - does grunt work beforehand -
      Application.includes(:preferences).where(
        applicant_id: params[:applicant_id],
        id: params[:id]).take! # take! - no order, takes the first off returned results
    else
      Application.includes(:preferences).find(params[:id])
    end

    # convert preferences into json - since we did the grunt work before this will be easy -
    render json: @application.to_json(include: [:preferences])
  end

end
