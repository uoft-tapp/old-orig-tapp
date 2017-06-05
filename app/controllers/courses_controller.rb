class CoursesController < ApplicationController
  def read_json
    @reader = ChassImporter.new("seeds/mock_chass")
    render json: @reader.applicant_data
  end
end
