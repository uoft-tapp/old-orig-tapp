class ApplicantsController < ApplicationController
  def index
    @applicants = Applicant.all
    render json: @applicants.to_json
  end

  def show
    @applicants = Applicant.where("id = ?", params[:id])
    render json: @applicants.to_json
  end

end
