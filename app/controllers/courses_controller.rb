class CoursesController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    @courses = Course.all.includes(:instructor, :positions)
    render json: @courses.to_json(include: [:instructor, :positions])
  end
end
