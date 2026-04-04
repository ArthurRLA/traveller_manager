Rails.application.routes.draw do
  root "home#index"

  namespace :ships do
    resources :builder, except: [:edit, :update] do
      member do
        get   "step/:step_number", action: :step,        as: :step
        patch "step/:step_number", action: :update_step, as: :update_step
      end
    end
  end
end