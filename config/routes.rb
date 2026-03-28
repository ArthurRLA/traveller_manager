Rails.application.routes.draw do
  root "ships#index"

  resources :ships do
    member do
      get  "step/:step_number", action: :step, as: :step
      patch "step/:step_number", action: :update_step, as: :update_step
    end
  end
end