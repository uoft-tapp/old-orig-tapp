class CoursesController < ApplicationController
  def list
    column_names = ["title AS course_id", "courses.course_name AS course_name",
      "'Summer 2017' AS semester", "courses.campus_code AS campus",
      "estimated_count AS positions", "courses.instructor_id AS instructor",
      "hours AS hr_position", "1000 AS enrollment", "qualifications",
      "duties"]
    join_course = "INNER JOIN courses on positions.course_code=courses.code"
    render json: Position.joins(join_course).select(column_names)
  end
end
