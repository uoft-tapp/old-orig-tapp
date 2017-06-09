class CoursesController < ApplicationController
  def index
    if params[:code] == nil
      @courses = Course.all.includes(:instructor, :positions)
    else
      condition = {code: params[:code].upcase}
      @courses = Course.where(condition).includes(:instructor, :positions)
    end
    render json: @courses.to_json(include: [:instructor, :positions])
  end
end
