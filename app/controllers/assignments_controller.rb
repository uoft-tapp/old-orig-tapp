class AssignmentsController < ApplicationController

 ## TD: check if this all works, then create a few records in the assignments table
 ## - lastly implement destroy 

  def index
    # send applicants that have been assigned
    @assignments = if params[:applicant_id].present? do
      Assignment.includes(:applicants).where(applicant_id: params[:applicant_id])
    else
      Assignment.includes(:applicants).all
    end
    render json: @assignments.to_json(include: [:applicants])
  end

  def show
    # Get all the assignments based off applicant_id and/or ID, include applicants
    @assignment = if params[:applicant_id].present? do
      Assignments.includes(:applicants).where(id: params[:id], applicant_id: params[:applicant_id]).take!
    else
      Assignment.includes(:applicants).find(params[:id])
    end
    render json: @assignment.to_json(include: [:applicants])
  end

  def create
    # Create an assignment
    @applicant = Applicant.find(params[:applicant_id])
    @applicant.assignment.create!(assignment_params)
  end

  def destroy
  end

  private
    def assignment_params
      params.require(:assignment).permit(:round_id, :hours)
    end

end
