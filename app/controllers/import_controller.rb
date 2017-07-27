class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    puts "importing...."
    puts params.as_json
  end

end
