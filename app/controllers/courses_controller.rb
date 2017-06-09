class CoursesController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    if params[:code] == nil
      @courses = Course.all.includes(:instructor, :positions)
    else
      condition = {code: params[:code].upcase}
      @courses = Course.where(condition).includes(:instructor, :positions)
    end
    render json: @courses.to_json(include: [:instructor, :positions])
  end

  def update
    condition = {id: params[:id]}
    if Position.exists?(condition)
      course_code = Position.where(condition).pluck(:course_code)

      get_course_condition = {code: course_code}
      course_data = {estimated_enrolment: params[:estimated_enrolment]}
      update_table(Course, get_course_condition, course_data)
    end
  end

  private
  def update_table(table, condition, data)
    row = table.where(condition)
    puts row.to_json()
    row.update(data)
    puts row.to_json()
  end

#    params.require(:course).permit()
end
