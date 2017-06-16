class PositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @positions = Position.all.includes(:instructor)
    render json: @positions.to_json(include: [:instructor])
  end

  def update
    position = Position.find(id: params[:id])
    position.update_attributes!(position_params)
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours, :open, :estimated_enrolment)
  end

end
