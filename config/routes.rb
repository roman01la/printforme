Printform::Application.routes.draw do
  devise_for :users,
    :controllers => {:registrations => 'registrations'},
    :path => '',
    :path_names => {
      :sign_in => 'signin',
      :sign_out => 'signout',
      :sign_up => 'signup'
    }

  # Registration additional links.
  get '/signup/2' => 'profile#registration_additional_info'

  # Printers.
  get '/printers' => 'printers#list'
  get '/printers/new' => 'printers#new'
  get '/printers/:printer' => 'printers#show'

  # User's profile.
  get '/:username' => 'profile#show'

  # Startpage
  root 'home#show'
end
