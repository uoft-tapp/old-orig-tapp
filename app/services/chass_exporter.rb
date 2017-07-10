class ChassExporter
    def initialize
      @assignments = Assignment.all.includes([:position, :applicant])
      @applicants = Applicant.all.includes([:applications])
    end

    def export(round_id)
      if is_valid_round_id(round_id)
        if @assignments.size == 0
          puts "Warning: You have not made any assignments. Operation aborted."
        else
          data = create_data(round_id)
          write_export_file(data)
          puts "Success: Assignments have been exported"
        end
      else
        puts "Error: Invalid round_id"
      end
    end

    private
    def write_export_file(data)
      json = JSON.pretty_generate(data)
      File.open("#{Rails.root}/db/seeds/export_data.json", "w") do |file|
        file.puts "assignments = #{json}"
      end
    end

    def is_valid_round_id(round_id)
      @positions = Position.all
      valid = false
      @positions.each do |position|
        if position[:round_id]==round_id.to_i
          valid = true
        end
      end
      return valid
    end

    def create_data(round_id)
      data = []
      @assignments.each do |assignment|
        hours = assignment[:hours]
        course = assignment.position
        if course[:round_id]==round_id.to_i
          course_id = course[:position]
          round_id = course[:round_id]
          applications = @applicants.find(assignment.applicant[:id]).applications
          application = get_application(applications, round_id)
          applicant = assignment.applicant
          if application
            app_id = application[0][:app_id]
            data.push({
              app_id: app_id,
              course_id: course_id,
              hours: hours,
              round_id: round_id.to_s,
              utorid: applicant[:utorid],
              name: "#{applicant[:first_name]} #{applicant[:last_name]}"
            })
          end
        end
      end
      return data
    end

    def get_application(applications, round_id)
      applications.each do |application|
        if application[:round_id]==round_id
          return application[:round_id]
        end
      end
    end

end
