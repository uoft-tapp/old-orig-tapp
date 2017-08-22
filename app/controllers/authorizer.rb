module Authorizer
  def is_admin(json=nil, status=200)
    if json
      data = get_render_json(json, status)
    end
    if logged_in
      if session[:role]=="Admin"
        if data
          render status: data[:status], json: data[:json]
        end
      else
        render status: 403, json: {message: "You are not authorized to access this route."}
      end
    else
      render status: 401, json: {message: "You are not logged in."}
    end
  end

  private
  def logged_in
    return session[:role] && session[:utorid]
  end

  def get_render_json(json, status)
    {json: json, status: status}
  end
end
