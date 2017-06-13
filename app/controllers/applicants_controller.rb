class ApplicantsController < ApplicationController
  def index
    @applicants = Applicant.all
    render json: @applicants.to_json
  end

  def show
    @applicants = Applicant.find(params[:id])
    render json: @applicants.to_json
  end

end
