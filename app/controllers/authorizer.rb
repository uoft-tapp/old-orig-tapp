module Authorizer

  def set_role(utorid)
    admins = ENV["ADMINS"].split(",")
    if admins.include?utorid
      session[:role] = "Admin"
      session[:utorid] = utorid
    end
  end

  def delete_role
    session= session.except(:role, :utorid)
  end

  def is_admin(func, params)
    if logged_in && session[:role]=="Admin"
      func(params)
    else
      render status: 403, json: {message: "You are not authorized to access this route."}
    end
  end

  def logged_in
    if session[:role] && session[:utorid]
      return true
    else
      render status: 401, json: {message: "You are not logged in."}
    end
  end
end
