class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @course_positions = Course.find(params[:course_code].upcase).positions
    render json: @course_positions.to_json()
  end

  def update
    position = Position.find_by!(id: params[:id],
      course_code: params[:course_code].upcase)
    position.update_attributes!(position_params)
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours)
  end

end
