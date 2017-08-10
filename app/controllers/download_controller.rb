class DownloadController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    if params[:round_id]
      file_path = "#{Rails.root}/db/exports/offers_#{params[:round_id]}.json"
      File.open(file_path, "rb") do |f|
        @data = f.read
      end
      File.delete(file_path)
      render_helper({generated:true, data: @data, content_type: "application/json", file: "offers_#{params[:round_id]}.json"})
    end
  end

  private
  def render_helper(response)
    if response[:generated]
      send_data response[:data], filename: response[:file],
      content_type: response[:type]
    else
      render status: 404, json: {
        message: response[:msg]
      }.to_json
    end
  end

end
