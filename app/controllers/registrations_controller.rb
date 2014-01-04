class RegistrationsController < Devise::RegistrationsController
  protected
  def after_sign_up_path_for(resource)
    signup_2_url
  end
end
