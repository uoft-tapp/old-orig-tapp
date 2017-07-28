class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    ChassImporter.new(params[:chass_json])
  end

end
