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
          dept: applicant_entry["dept"],
          program_id: applicant_entry["program_id"],
          yip: applicant_entry["yip"],
          address:applicant_entry["address"],
          commentary: ""
      )
      exists = "applicant #{utorid} already exists"
      insertion_helper(applicant, condition, exists)
    end
  end

    def insert_application
      @applicant_data.each do |applicant_entry|
        applicant = Applicant.where(utorid: applicant_entry["utorid"]).take!

        app_id = applicant_entry["app_id"].to_i
        check_duplicate = {app_id: app_id}

        application = applicant.applications.where(check_duplicate).take
        application ||= applicant.applications.build(
          app_id: app_id,
          round_id: @round_id,
          ta_training: applicant_entry["ta_training"],
          access_acad_history: applicant_entry["access_acad_history"],
          ta_experience: applicant_entry["ta_experience"],
          academic_qualifications: applicant_entry["academic_qualifications"],
          technical_skills: applicant_entry["technical_skills"],
          availability: applicant_entry["availability"],
          other_info: applicant_entry["other_info"],
          special_needs: applicant_entry["special_needs"],
          raw_prefs: applicant_entry["course_preferences"]
        )
        Rails.logger.debug "application #{app_id} already exists" unless application.new_record?
        application.save!

        applicant_entry["courses"].each do |position|
          position_ident = {position: position, round_id: @round_id}
          position_row = Position.where(position_ident).select(:id).take
          Rails.logger.debug position_row

          if position_row
            position_id = position_row.id
            preference_ident = {position_id: position_id}
            preference = application.preferences.where(preference_ident).take
            preference ||= application.preferences.build(
              position_id: position_id,
              rank: 2
            )
            Rails.logger.debug "preference #{position_id} already exists" unless preference.new_record?
            preference.save!
          end
        end

        insert_preference(applicant_entry["course_preferences"], application)
      end
    end

  def insert_preference(preferences, application)
    parse_preference(preferences).each do |preference|
      position_ident = {position: preference.strip, round_id: @round_id}
      position = Position.where(position_ident).select(:id).take
      if position
        preference_ident = {position_id: position.id}
        application.preferences.where(preference_ident).update(rank: 1)
      end
    end
  end

  def parse_preference(pref)
    list = pref.split(',')
  end

  def insert_positions
    @course_data.each do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip
      round_id = course_entry["round_id"]

      condition = Position.where(position: posting_id, round_id: round_id).exists?
      position = Position.new(
        position: posting_id,
        round_id: round_id,
        open: true,
        campus_code: course_id[course_id[/[A-Za-z0-9]{3}\d{3,4}/].size+1].to_i,
        course_name: course_entry["course_name"],
        estimated_enrolment: course_entry["enrollment"],
        duties: course_entry["duties"],
        qualifications: course_entry["qualifications"],
        hours: course_entry["n_hours"],
        estimated_count: course_entry["n_positions"],
        estimated_total_hours: course_entry["total_hours"],
      )
      exists = "Position #{posting_id} already exists"
      insertion_helper(position, condition, exists)

      Rails.logger.debug "#{position.new_record?} #{position.valid?} #{position.attributes.inspect}"

      course_entry["instructor"].each do |instructor|
        name = instructor["first_name"]+" "+instructor["last_name"]
        instructor_ident = Instructor.find_by(name: name)
        if !instructor_ident
          Instructor.create!(
            name: name,
            email: instructor["email"],
            utorid: instructor["utorid"],
          )
          instructor_ident = Instructor.find_by(name: name)
        end
        if instructor_ident
          position.instructors << [instructor_ident]
        end
      end

    end
  end

end
