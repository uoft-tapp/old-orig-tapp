class ApplicationsController < ApplicationController
  def index
    @applications = Application.all
    render json: @applications.to_json
  end

  def show
    @applications = Application.where("applicant_id = ?", params[:id])
    render json: @applications.to_json
  end

end
