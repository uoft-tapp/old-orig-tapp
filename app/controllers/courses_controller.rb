class CoursesController < ApplicationController
  def read_json
    @reader = JsonReader.new("seeds/courses", "course")
    render json: @reader.course_data
  end
end

class JsonReader
  attr_reader :course_data, :applicant_data

  def initialize(file, type)
    @data = File.read("#{Rails.root}/db/#{file}.json")
    if type == "course"
      @course_data = JSON.parse(@data)["courses"]
      insert_courses
    else
      @applicant_data = JSON.parse(@data)["applicants"]
      insert_applicant_data
    end
  end

  def insert_course_data
    self.insert_courses
    self.insert_positions
  end

  def insert_applicant_data
    self.insert_applicant
  end

  private
  def insert_applicant
    @applicant_data.map do |applicant|
      applicant = Applicant(
      
      )
    end
  end

  def insert_courses
    @course = @course_data.map do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip

      unless Course.exists? course_id
        course = Course.new(
          code: course_id,
          campus_code: course_id[course_id[/[A-Za-z]{3}\d{3,4}/].size+1].to_i,
          instructor_id: nil,
          course_name: course_entry["course_name"],
          estimated_enrolment: course_entry["enrollment"]
        )

        Rails.logger.debug course.attributes
        course.save!
      else
        Rails.logger.debug "Course #{course_id} already exists"
      end

      course
    end
  end

  def insert_positions
    @position = @course_data.map do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip

      unless Position.exists? posting_id
        Position.create!(
          course_code: course_id,
          title: posting_id,
          duties: course_entry["duties"],
          qualifications: course_entry["qualifications"],
          hours: course_entry["n_hours"],
          estimated_count: course_entry["n_positions"],
          estimated_total_hours: course_entry["total_hours"],
        )
        Rails.logger.debug course.attributes
        course.save!
      else
        Rails.logger.debug "Position #{posting_id} already exists"
      end
    end
  end
end

# course_id "CSC108H1S"
# or "CSC108H1Y"
# => { department_code: "CSC", course_code: "108" ... }
