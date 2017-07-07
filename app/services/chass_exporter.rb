class ChassExporter
    def initialize(file)
      @assignments = Assignment.all.includes([:position, :applicant])
      @applicants = Applicant.all.includes([:applications])
      data = create_data
      write_export_file(file, data)
    end

    private
    def write_export_file(file, data)
      json = JSON.pretty_generate(data)
      File.open("#{Rails.root}/db/#{file}.json", "w") do |file|
        file.puts "assignments = #{json}"
      end
    end

    def create_data
      data = []
      @assignments.each do |assignment|
        hours = assignment[:hours]
        course_id = assignment.position[:position]
        round_id = assignment.position[:round_id]
        applications = @applicants.find(assignment.applicant[:id]).applications
        application = get_application(applications, round_id)
        if application
          app_id = application[0][:app_id]
          data.push({
            app_id: app_id,
            course_id: course_id,
            hours: hours,
            round_id: round_id.to_s
          })
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
