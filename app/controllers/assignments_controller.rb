class AssignmentsController < ApplicationController
  protect_from_forgery with: :null_session

 '''
    index #GET
      /assignments - returns a list of applicant including their assignment data
      /applicants/:applicant_id/assignments - returns an assignments given an applicant ID
 '''
  def index
      @assignments = if params[:applicant_id].present?
        Applicant.find(params[:applicant_id]).assignments
      else
        Assignment.all
      end

    render json: @assignments.to_json
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
      hours, position_id

      creates an assignment between an applicant and a position.
      returns status 409 if tries to create a duplicate
  '''
  def create
    # check if the position is open
    is_open = Position.where(id: params[:position_id], open: false).exists?
    has_assignment = Assignment.where(position_id: params[:position_id]).exists?

    # if an assignment exists on the current position, and position is open
    unless has_assignment && is_open
      @applicant = Applicant.find(params[:applicant_id])
      assignment = @applicant.assignments.build(assignment_params)

      if assignment.save
        render json: assignment.to_json
      else
        render json: assignment.errors.to_hash(true), status: :unprocessable_entity
      end
    else
      head :conflict
    end
  end

  '''
    update #PATCH
    /applicants/:applicant_id/assignments/:id
    hours

    updates the hours column for an applicant given assignment ID and applicant ID
  '''
  def update
    @applicant = Applicant.find(params[:applicant_id])
    assignment = @applicant.assignments.find(params[:id])

    if assignment.update_attributes(hours: params[:hours])
      render json: assignment.to_json
    else
      render json: assignment.errors.to_hash(true), status: :unprocessable_entity
    end
  end


  '''
    destroy #DELETE
    /applicants/:applicant_id/assignments/:id

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
      params.permit(:position_id, :hours)
    end
end
