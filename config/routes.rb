Rails.application.routes.draw do
  resources :apidocs, only: [:index]

  get 'pages/index'

  scope '/api' do
    match 'products/options' => 'products#options', :via => :get, :as => :products_options
    match 'products/count' => 'products#count', :via => :get, :as => :products_count
    resources :products

    match 'categories/options' => 'categories#options', :via => :get, :as => :categories_options
    match 'categories/count' => 'categories#count', :via => :get, :as => :categories_count
    resources :categories
  end

  root to: 'pages#index'
end
