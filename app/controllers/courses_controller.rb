class CoursesController < ApplicationController
  def index
    @courses = Course.all.includes(:instructor, :positions)
    render json: @courses.to_json(include: [:instructor, :positions])
  end
end
