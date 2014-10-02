ShapterApi::Application.routes.draw do
  get "facebook_pages/:base64Params" => 'facebook_pages#index'
  get "home/index"
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks"}
  mount API => '/'
  mount GrapeSwaggerRails::Engine => '/apidoc'

  root :to => "home#index"
end
