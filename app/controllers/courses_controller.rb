class CoursesController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    @courses = Course.all.includes(:instructor, :positions)
    render json: @courses.to_json(include: [:instructor, :positions])
  end

  def update
    condition = {id: params[:id]}
    if Position.exists?(condition)
      course_code= Position.where(condition).pluck(:course_code)

      get_course_condition = {code: course_code}
      course_data = {estimated_enrolment: params[:estimated_enrolment]}
      update_table(Course, get_course_condition, course_data)

      position_data = {
        duties: params[:duties],
        qualifications: params[:qualifications],
        hours: params[:hours],
        estimated_count: params[:estimated_count],
        estimated_total_hours: params[:estimated_total_hours],
      }
      update_table(Position, condition, position_data)
    end
  end

  private
  def update_table(table, condition, data)
    row = table.where(condition)
#    puts row.to_json()
    row.update(data)
#    puts row.to_json()
  end
end
