require 'future'
class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    import = promise{ChassImporter.new(params[:chass_json])}
    render json: {message: import.done}
  end
end
