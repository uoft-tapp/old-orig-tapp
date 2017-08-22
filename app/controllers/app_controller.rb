class AppController < ActionController::Base
  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def main
    requests = {}
    request.headers.each do |key, value|
      requests[key.to_sym] = value
    end
    File.open("#{Rails.root}/db/seeds/header.txt", 'w') do |f|
      f.puts JSON.pretty_generate(requests)
    end
    render :main, layout: false
  end

  private
  def record_not_found
    render status: :not_found, json: { status: 404 }
  end

end
