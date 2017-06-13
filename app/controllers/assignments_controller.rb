class AssignmentsController < ApplicationController
  protect_from_forgery with: :null_session

 '''
    index #GET
      /assignments - returns a list of applicant including their assignment data
      /applicants/:applicant_id/assignments - returns an assignments given an applicant ID
 '''
  def index
    @applicant = if params[:applicant_id].present?
        Applicant.includes(:assignments).find(params[:applicant_id])
      else
        Applicant.includes(:assignments).all
      end

    render json: @applicant.to_json(include: [:assignments])
  end

  '''
    show #GET
      /assignments/:id - returns an assignment given an assignment ID
      /applicants/:applicant_id/assignments/:id - returns an assignment given an ID, for a given applicant ID
  '''
  def show
    # Get all the assignments based off applicant_id and/or ID, include applicants
    @assignments = if params[:applicant_id].present?
        Assignment.where(id: params[:id], applicant_id: params[:applicant_id]).take!
      else
        Assignment.find(params[:id])
      end

    render json: @assignments.to_json
  end

  '''
    create #POST
      /applicants/:applicant_id/assignments
      round_id, hours, position_id

      creates an assignment between an applicant and a position.
      returns status 209 if tries to create a duplicate
  '''
  def create
    has_assignment = Assignment.where(round_id: params[:round_id], position_id: params[:position_id]).exists?

    unless has_assignment
      @applicant = Applicant.find(params[:applicant_id])
      @applicant.assignments.create!(assignment_params)

      render json: @applicant.to_json(include: [:assignments])
    else
      render json: { status: 209 } # conflict
    end
  end

  '''
    update #PATCH
    /applicants/:applicant_id/assignment/:id
    hours

    updates the hours column for an applicant given assignment ID and applicant ID
  '''
  def update
    @applicant = Applicant.find(params[:applicant_id])
    @assignment = @applicant.assignments.find(params[:id])

    @assignment.update!(hours: params[:hours])

    render json: @assignment.to_json(include: [:applicant])
  end


  '''
    destroy #DELETE
    /applicants/:applicant_id/assignment/:id

    removes (unassigns) an assignment record give an applicant ID and assignment ID
  '''
 # Unassign an assignee using applicant_id and assignment ID
  def destroy
    @applicant = Applicant.find(params[:applicant_id])
    @assignment = @applicant.assignments.find(params[:id])

    @assignment.destroy!
  end



  private
    def assignment_params
      params.permit(:position_id, :round_id, :hours)
    end
end
