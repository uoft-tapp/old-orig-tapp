class ExportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    exporter = ChassExporter.new
    response = exporter.export(params[:round_id])
    if response[:generated]
      send_file("#{Rails.root}/db/seeds/export_data.json")
    else
      render status: 404, json: {
        message: response[:msg]
      }.to_json
    end
  end

end
