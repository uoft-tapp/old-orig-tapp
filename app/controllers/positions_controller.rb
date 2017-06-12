class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    condition = {course_code: params[:course_code].upcase}
    @course_positions = Position.where(condition)
    render json: @course_positions.to_json()
  end

  def update
    position = Position.find(params[:id])
    position.update_attributes!(position_params)
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours)
  end


end
