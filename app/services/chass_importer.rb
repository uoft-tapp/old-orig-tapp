class ChassImporter
  attr_reader :course_data, :applicant_data, :round_id

  def initialize(file)
    @data = File.read("#{Rails.root}/db/#{file}.json")
    raise JSON::ParserError.new("the source file is empty") if @data.strip.length == 0

    parsed_data = JSON.parse(@data)
    @course_data = parsed_data.fetch("courses")
    @applicant_data = parsed_data.fetch("applicants")
    @round_id = get_round_id
    insert_data
  end

  private
  def insert_data
    insert_courses
    insert_positions
    insert_applicant
    insert_application
  end

  def get_round_id
    round_ids = @course_data.map { |course_entry| course_entry["round_id"] }.uniq
    case round_ids.length
    when 0
      raise StandardError.new("no round_id found in the file")
    when 1
      return round_ids.first
    else
      raise StandardError.new("too many round_ids found in the file")
    end
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
    @applicant_data.each do |applicant_entry|
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
      @applicant_data.each do |applicant_entry|
        applicant = Applicant.where(utorid: applicant_entry["utorid"]).take!

        app_id = applicant_entry["app_id"].to_i
        check_duplicate = {app_id: app_id, round_id: @round_id}

        application = applicant.applications.where(check_duplicate).take
        application ||= applicant.applications.build(
          app_id: app_id,
          round_id: @round_id,
          ta_experience: applicant_entry["ta_experience"],
          research: applicant_entry["research"],
          comments: applicant_entry["comments"],
          availability: applicant_entry["availability"],
          degrees: applicant_entry["degrees"],
          work_experience: applicant_entry["work_experience"],
          hours_owed: applicant_entry["hours_owed"],
          pref_session: applicant_entry["pref_session"],
          pref_campus: applicant_entry["pref_campus"],
          deferral_status: applicant_entry["deferral_status"],
          deferral_reason: applicant_entry["deferral_reason"],
          appointment_number: applicant_entry["appointment_no"])

        Rails.logger.debug "application #{app_id}, #{round_id} already exists" unless application.new_record?
        application.save!

        parse_preference(applicant_entry["preferences"]).each do |pref|
          position_id = Position.where(title: pref[:position]).select(:id).take!.id

          preference_ident = {position_id: position_id}
          preference = application.preferences.where(preference_ident).take
          preference ||= application.preferences.build(
            position_id: position_id,
            rank: pref[:rank])

          Rails.logger.debug "preference #{position_id}, #{pref[:rank]} already exists" unless preference.new_record?
          preference.save!
        end
      end
    end

  def parse_preference(pref)
    list = pref.split(',')
    preferences = list.map do |pref|
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
    @course_data.each do |course_entry|
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
    @course_data.each do |course_entry|
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
