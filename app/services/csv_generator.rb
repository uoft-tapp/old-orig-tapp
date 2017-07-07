class CSVGenerator

  def initialize
    @assignments = Assignment.all.includes([:position, :applicant])
    @applicants = Applicant.all.includes([:applications])
  end

  def generate_cdf_info
  #  data = get_cdf_info
  #  write_export_file("cdf_info", data)
  end

  def generate_offers
  #  data = get_offers
  #  write_export_file("offers", data)
  end

  def generate_transcript_access
    data = get_transcript_access
    attributes = generate_csv_string([
      "studentnumber",
      "familyname",
      "givenname",
      "grant",
      "emailaddress"
    ])
    write_export_file("transcript_access", data, attributes)
  end

  private
  def write_export_file(file, data, attributes)
    File.open("#{Rails.root}/db/seeds/#{file}.csv", "w") do |file|
      file.puts "#{attributes}#{data}"
    end
  end

  def generate_csv_string(row)
    csv_string = ""
    row.each do |item|
      csv_string = (csv_string + item + ", ")
    end
    return (csv_string[0, csv_string.size-2]+"\n")
  end

  def get_transcript_access
    data = ""
    @applicants.each do |applicant|
      application =  applicant.applications[0]
      csv_string = generate_csv_string([
        applicant[:student_number],
        applicant[:last_name],
        applicant[:first_name],
        has_access(application[:access_acad_history]).to_s,
        applicant[:email],
      ])
      data = (data + csv_string)
    end
    return data
  end

  def has_access(access)
    case access
    when "N"
      return false
    when "Y"
      return true
    end
  end

end
