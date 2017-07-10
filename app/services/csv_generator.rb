class CSVGenerator

  def initialize
    @assignments = Assignment.all.includes([:position, :applicant])
    @applicants = Applicant.all.includes([:applications])
    @courses = {}
  end

  def generate_cdf_info
    if @assignments.size == 0
      puts "Warning: You have not made any assignments yet. Operation aborted"
    else
      data = get_cdf_info
      attributes = generate_csv_string([
        "course_code",
        "email_address",
        "studentnumber",
        "familyname",
        "givenname",
        "student_department",
        "utorid",
      ])
      write_export_file("cdf_info", data, attributes)
      puts "Success: CDF info CSV file created"
    end
  end

  def generate_offers
    if @assignments.size == 0
      puts "Warning: You have not made any assignments yet. Operation aborted"
    else
      data = get_offers
      attributes = generate_csv_string([
        "course_code",
        "course_title",
        "offer_hours",
        "student_number",
        "familyname",
        "givenname",
        "student_status",
        "student_department",
        "email_address",
        "round_id",
      ])
      write_export_file("offers", data, attributes)
      puts "Success: Offer CSV file created"
    end
  end

  def generate_transcript_access
    data = get_transcript_access
    attributes = generate_csv_string([
      "student_number",
      "familyname",
      "givenname",
      "grant",
      "email_address"
    ])
    write_export_file("transcript_access", data, attributes)
    puts "Suceess: Transcript Access CSV file created"
  end

  private
  def write_export_file(file, data, attributes)
    File.open("#{Rails.root}/db/seeds/#{file}.csv", "w") do |file|
      file.puts "#{attributes}#{data}"
    end
  end

  def get_cdf_info
    data =""
    @assignments.each do |assignment|
      course = assignment.position
      applicant = assignment.applicant
      csv_string = generate_csv_string([
        course[:position],
        applicant[:email],
        applicant[:student_number],
        applicant[:last_name],
        applicant[:first_name],
        applicant[:dept],
        applicant[:utorid],
      ])
      data = (data + csv_string)
    end
    return data
  end

  def generate_csv_string(row)
    csv_string = ""
    row.each do |item|
      csv_string = (csv_string + item + ", ")
    end
    return (csv_string[0, csv_string.size-2]+"\n")
  end

  def get_offers
    data = ""
    @assignments.each do |assignment|
      course = assignment.position
      applicant = assignment.applicant
      course_code = course[:position]
      csv_string = generate_csv_string([
        course[:position],
        course[:course_name],
        assignment[:hours].to_s,
        applicant[:student_number].to_s,
        applicant[:last_name],
        applicant[:first_name],
        get_status(applicant[:program_id]),
        applicant[:dept],
        applicant[:email],
        course[:round_id].to_s,
      ])
      data = (data + csv_string)
    end
    return data
  end

  def get_status(program_id)
    case program_id
    when '7PDF'
      return 'PostDoc'
    when '1PHD'
      return 'PhD'
    when '2Msc'
      return 'MSc'
    when '4MASc'
      return 'MASc'
    when '8UG'
      return 'UG'
    else
      return 'Other'
    end
  end

  def get_transcript_access
    data = ""
    @applicants.each do |applicant|
      application =  applicant.applications[0]
      csv_string = generate_csv_string([
        applicant[:student_number],
        applicant[:last_name],
        applicant[:first_name],
        application[:access_acad_history].downcase,
        applicant[:email],
      ])
      data = (data + csv_string)
    end
    return data
  end

end
