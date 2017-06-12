class CoursesController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    @courses = Course.all.includes(:instructor, :positions)
    render json: @courses.to_json(include: [:instructor, :positions])
  end

  def update
    course = Course.find(params[:code].upcase)
    params[:course] = course
    course.update_attributes!(course_params)
  end

  private
  def course_params
    params.require(:course).permit(:estimated_enrolment)
  end
end
