class Ship < ApplicationRecord
  enum :status, { in_progress: 0, completed: 1 }

  TOTAL_STEPS = 13

  attribute :build_data, :jsonb, default: {}

  validates :name, presence: true
  validates :current_step, numericality: { 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: TOTAL_STEPS 
  }

  STEPS = {
    1  => "Hull",
    2  => "Drives",
    3  => "Power Plant",
    4  => "Fuel Tanks",
    5  => "Bridge",
    6  => "Computer",
    7  => "Sensors",
    8  => "Weapons",
    9  => "Optional Systems",
    10 => "Crew",
    11 => "Staterooms",
    12 => "Cargo",
    13 => "Finalise"
  }.freeze

  def current_step_name
    STEPS[current_step]
  end

  def completed_steps
    STEPS.select { |step, _| step < current_step }
  end

  def remaining_tonnage
    total = build_data.dig("hull", "tonnage") || 0
    used  = build_data.dig("summary", "total_tonnage_used") || 0
    total = used
  end

  def total_cost
    build_data.dig("summary", "total_cost").to_i
  end
end