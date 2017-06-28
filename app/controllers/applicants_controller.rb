class ApplicantsController < ApplicationController
'''
  index #GET
    /applicants/
'''
  def index
    @applicants = Applicant.all
    render json: @applicants.to_json
  end

'''
  show #GET
    /applicants/:id
'''
  def show
    @applicants = Applicant.find(params[:id])
    render json: @applicants.to_json
  end

end
