class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @positions = Position.all.includes(:instructors)
    render json: @positions.to_json(include: [:instructors])
  end

  def show
    position = Position.includes(:instructors).find(params[:id])
    render json: position.to_json(include: [:instructors])
  end

  def update
    position = Position.find(params[:id])
    position.update_attributes!(position_params)
    if params[:instructors]
      puts 'not null'
      position.instructor_ids = JSON.parse params[:instructors]
    else
      puts 'null'
    end
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours, :open, :estimated_enrolment)
  end

end
