class ProfileController < ApplicationController
  def show
    @user = User.find_by_username(params['username']) || not_found
  end

  def registration_additional_info
    # Step #2 of registration process.
    # We need to collect some additional attributes so lets render this page.
  end
end
