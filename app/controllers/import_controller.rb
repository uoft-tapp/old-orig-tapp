class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    render json: params[:chass_json].to_json
  end

end
