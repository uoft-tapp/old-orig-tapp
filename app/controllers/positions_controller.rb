class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    condition = {course_code: params[:course_code].upcase}
    @course_positions = Position.where(condition)
    render json: @course_positions.to_json()
  end

  def update
    position = Position.find(params[:id])
    data = {
      duties: params[:duties],
      qualifications: params[:qualifications],
      hours: params[:hours],
      estimated_count: params[:estimated_count],
      estimated_total_hours: params[:estimated_total_hours],
    }
    puts position.to_json()
    position.update(data)
    puts position.to_json()
  end

end
