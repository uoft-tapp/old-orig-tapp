class SessionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: Session.all.to_json
  end

  def show
    session = Session.find(params[:id])
    render json: session.to_json
  end
end
