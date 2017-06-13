class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    condition = {course_code: params[:course_code].upcase}
    @course_positions = Position.where(condition)
    render json: @course_positions.to_json()
  end
end
