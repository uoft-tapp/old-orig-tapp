class CoursesController < ApplicationController
  def read_json
    @reader = JsonReader.new("seeds/mock_chass")
    render json: @reader.applicant_data
  end
end

class JsonReader
  attr_reader :course_data, :applicant_data, :round_id

  def initialize(file)
    @data = File.read("#{Rails.root}/db/#{file}.json")
    @course_data = JSON.parse(@data)["courses"]
    @applicant_data = JSON.parse(@data)["applicants"]
    @round_id = get_round_id
    insert_data
  end

  private
  def insert_data
    insert_courses
    insert_positions
    insert_applicant
    insert_application
    insert_assignment
    insert_preference
  end

  def get_round_id
    return @course_data[0]["round_id"]
  end

  def insertion_helper(model, condition, exists)
    unless condition
      db_model = model
      Rails.logger.debug db_model.attributes
      db_model.save!
    else
      Rails.logger.debug "#{exists}"
    end
  end

  def insert_applicant
    @applicant_data.map do |applicant_entry|
      utorid = applicant_entry["utorid"]
      condition = Applicant.where(utorid: utorid).exists?
      
      applicant = Applicant.new(
          utorid: utorid,
          student_number: applicant_entry["student_no"],
          first_name:applicant_entry["first_name"],
          last_name: applicant_entry["last_name"],
          email:applicant_entry["email"],
          phone: applicant_entry["phone"],
          address:applicant_entry["address"]
      )
      exists = "applicant #{utorid} already exists"
      insertion_helper(applicant, condition, exists)
    end
  end

    def insert_application
      @applicant_data.map do |applicant_entry|
        utorid = applicant_entry["utorid"]
        check_duplicate = ["app_id = ? and round_id = ?", utorid, @round_id]

        condition = Application.where(check_duplicate).exists?
        application = Application.new(
          applicant_id: applicant_entry["app_id"].to_i,
          app_id: utorid,
          round_id: @round_id,
          ta_experience:applicant_entry["ta_experience"],
          research:applicant_entry["research"],
          comments:applicant_entry["comments"],
          availability:applicant_entry["availability"],
          degrees:applicant_entry["degrees"],
          work_experience:applicant_entry["work_experience"],
          hours_owed:applicant_entry["hours_owed"],
          pref_session:applicant_entry["pref_session"],
          pref_campus:applicant_entry["pref_campus"],
          deferral_status:applicant_entry["deferral_status"],
          deferral_reason:applicant_entry["deferral_reason"],
          appointment_number:applicant_entry["appointment_no"],
        )
        exists = "application #{utorid}, #{round_id} already exists"
        insertion_helper(application, condition, exists)
      end
    end

    def insert_assignment
      @applicant_data.map do |applicant_entry|
        utorid = applicant_entry["utorid"]
        applicant_id = Applicant.where(utorid: utorid).pluck("id")[0]

        applicant_entry["courses"].map do |course_entry|
          position_id = Position.where(title: course_entry).pluck("id")[0]
          check_duplicate = ["applicant_id = ? and position_id = ? and round_id = ?",
            applicant_id, position_id, @round_id]

          condition = Assignment.where(check_duplicate).exists?
          assignment = Assignment.new(
            applicant_id: applicant_id,
            position_id: position_id,
            round_id: @round_id
          )
          exists = "assignment #{utorid}, #{course_entry}, #{round_id} already exists"
          insertion_helper(assignment, condition, exists)
        end

      end
    end

  def insert_preference
    @applicant_data.map do |applicant_entry|
      utorid = applicant_entry["utorid"]
      applicant_id = Application.where(app_id: utorid).pluck("id").first
      preferences = parse_preference(applicant_entry["preferences"])

      preferences.map do |pref|
        position = pref[:position]
        rank = pref[:rank]
        position_id = Position.where(title: position).pluck("id").first
        check_duplicate = ["application_id = ? and position_id = ? and rank = ?",
          applicant_id, position_id, rank]

        condition = Preference.where(check_duplicate).exists?
        preference = Preference.new(
          application_id: applicant_id,
          position_id: position_id,
          rank: rank
        )
        exists = "preference #{utorid}, #{position}, #{rank} already exists"
        insertion_helper(preference, condition, exists)
      end
    end
  end

  def parse_preference(pref)
    @list = pref.split(',')
    @preferences = @list.map do |pref|
      full = pref.strip
      code = pref.split('(')[0].strip
      rank = (pref.split("(")[1]).split(')')[0]
      {
        position: code,
        rank: get_rank(rank)
      }
    end
  end

  def get_rank(rank)
    case rank
    when "1st Choice"
      return 1
    when "2nd Choice"
      return 2
    when "3rd Choice"
      return 3
    when "Preferred"
      return 4
    when "Willing"
      return 5
    end
  end


  def insert_courses
    @course = @course_data.map do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip

      condition = Course.exists? course_id
      course = Course.new(
        code: course_id,
        campus_code: course_id[course_id[/[A-Za-z]{3}\d{3,4}/].size+1].to_i,
        instructor_id: nil,
        course_name: course_entry["course_name"],
        estimated_enrolment: course_entry["enrollment"]
      )
      exists= "Course #{course_id} already exists"
      insertion_helper(course, condition, exists)
    end
  end

  def insert_positions
    @position = @course_data.map do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip

      condition = Position.where(title: posting_id).exists?
      position = Position.new(
        course_code: course_id,
        title: posting_id,
        duties: course_entry["duties"],
        qualifications: course_entry["qualifications"],
        hours: course_entry["n_hours"],
        estimated_count: course_entry["n_positions"],
        estimated_total_hours: course_entry["total_hours"],
      )
      exists = "Position #{posting_id} already exists"
      insertion_helper(position, condition, exists)
    end
  end
end
