class ApplicationController < ActionController::Base
  before_filter :configure_permitted_parameters, if: :devise_controller?

  protect_from_forgery with: :exception

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u|
      u.permit(:firstname, :lastname, :country, :city, :username, :email, :password, :password_confirmation)
    }
  end

  def not_found
    render '/public/404.html', :status => 404
  end
end
