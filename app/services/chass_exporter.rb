class ChassExporter
    def initialize(file)
      assignments = Assignment.all.includes([:position, :applicant])
      applicants = Applicant.all.includes([:applications])
      data=[]
      assignments.each do |assignment|
        hours = assignment[:hours]
        course_id = assignment.position[:position]
        round_id = assignment.position[:round_id]
        applications = applicants.find(assignment.applicant[:id]).applications
        app_id = applications[0][:app_id]
        data.push({
          app_id: app_id,
          course_id: course_id,
          hours: hours,
          round_id: round_id.to_s
        })
      end
      json = JSON.pretty_generate(data)
      File.open("#{Rails.root}/db/#{file}.json", "w") do |file|
        file.puts "assignments = #{json}"
      end
    end
end
