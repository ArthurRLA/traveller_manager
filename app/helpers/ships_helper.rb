module ShipsHelper
  def step_status_class(step_number, ship)
    if step_number < ship.current_step
      "completed"
    elsif step_number == ship.current_step
      "active"
    else
      "pending"
    end
  end
end