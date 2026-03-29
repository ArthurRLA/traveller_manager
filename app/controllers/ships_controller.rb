class ShipsController < ApplicationController
  before_action :set_ship, only: %i[show step update_step destroy]

  def index
    @ships = Ship.all.order(created_at: :desc)
  end

  def new
    @ship = Ship.new
  end

  def create
    @ship = Ship.new(name: params[:ship][:name])
    @ship.status = :in_progress
    @ship.current_step = 1
    @ship.build_data = {}

    if @ship.save
      redirect_to step_ship_path(@ship, step_number: 1)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    redirect_to step_ship_path(@ship, step_number: @ship.current_step)
  end

  def step
    @step_number = params[:step_number].to_i
    @step_name   = Ship::STEPS[@step_number]

    render "ships/steps/step_#{@step_number}"
  end

  def update_step
    @step_number = params[:step_number].to_i

    step_data = step_params(@step_number)
    updated_build_data = @ship.build_data.merge(step_data)

    next_step = @step_number + 1

    if @ship.update(
      build_data: updated_build_data,
      current_step: [next_step, Ship::TOTAL_STEPS].min,
      status: next_step > Ship::TOTAL_STEPS ? :completed : :in_progress
    )
      if next_step > Ship::TOTAL_STEPS
        redirect_to @ship, notice: "Ship completed!"
      else
        redirect_to step_ship_path(@ship, step_number: next_step)
      end
    else
      render "ships/steps/step_#{@step_number}", status: :unprocessable_entity
    end
  end

  def destroy
    @ship.destroy
    redirect_to ships_path, notice: "Ship deleted."
  end

  private

  def set_ship
    @ship = Ship.find(params[:id])
  end

  def step_params(step_number)
    case step_number
    when 1
      hull = params.require(:hull).permit(:tonnage, :configuration, :cost, :hull_points)
      { "hull" => {
        "tonnage"       => hull[:tonnage].to_i,
        "configuration" => hull[:configuration],
        "cost"          => hull[:cost].to_i,
        "hull_points"   => hull[:hull_points].to_i
      }}
    when 2
      drives = params.require(:drives).permit(
        manoeuvre: %i[rating tonnage cost power],
        jump:      %i[rating tonnage cost power]
      )
      { "drives" => {
        "manoeuvre" => drives[:manoeuvre].transform_values(&:to_i),
        "jump"      => drives[:jump].transform_values(&:to_i)
      }}
    when 3
      pp = params.require(:power_plant).permit(:type, :tonnage, :cost, :power_generated)
      { "power_plant" => {
        "type"            => pp[:type],
        "tonnage"         => pp[:tonnage].to_i,
        "cost"            => pp[:cost].to_i,
        "power_generated" => pp[:power_generated].to_i
      }}
    when 4
      fuel = params.require(:fuel).permit(:jump_fuel, :power_fuel, :total_fuel)
      { "fuel" => {
        "jump_fuel"  => fuel[:jump_fuel].to_i,
        "power_fuel" => fuel[:power_fuel].to_i,
        "total_fuel" => fuel[:total_fuel].to_i
      }}
    when 5
      bridge = params.require(:bridge).permit(:type, :tonnage, :cost, :holographic)
      { "bridge" => {
        "type"        => bridge[:type],
        "tonnage"     => bridge[:tonnage].to_i,
        "cost"        => bridge[:cost].to_i,
        "holographic" => bridge[:holographic] == "1"
      }}
    when 6
      computer = params.require(:computer).permit(
        :total_cost,
        primary: %i[model bis fib cost],
        backup:  %i[model cost]
      )
      { "computer" => {
        "primary" => {
          "model" => computer.dig(:primary, :model),
          "bis"   => computer.dig(:primary, :bis) == "1",
          "fib"   => computer.dig(:primary, :fib) == "1",
          "cost"  => computer.dig(:primary, :cost).to_i
        },
        "backup" => {
          "model" => computer.dig(:backup, :model),
          "cost"  => computer.dig(:backup, :cost).to_i
        },
        "total_cost" => computer[:total_cost].to_i
      }}
    when 7
      sensors = params.require(:sensors).permit(:type, :tonnage, :cost, :power, :dm)
      { "sensors" => {
        "type"    => sensors[:type],
        "tonnage" => sensors[:tonnage].to_i,
        "cost"    => sensors[:cost].to_i,
        "power"   => sensors[:power].to_i,
        "dm"      => sensors[:dm].to_i
      }}
    when 8
      weapons = params.require(:weapons).permit(
        :data, :total_tonnage, :total_cost, :total_power
      )
      { "weapons" => {
        "data"          => JSON.parse(weapons[:data] || "[]"),
        "total_tonnage" => weapons[:total_tonnage].to_i,
        "total_cost"    => weapons[:total_cost].to_i,
        "total_power"   => weapons[:total_power].to_i
      }}
    when 9
      opt = params.require(:optional_systems).permit(
        :data, :total_tonnage, :total_cost, :total_power
      )
      { "optional_systems" => {
        "data"          => JSON.parse(opt[:data] || "[]"),
        "total_tonnage" => opt[:total_tonnage].to_i,
        "total_cost"    => opt[:total_cost].to_i,
        "total_power"   => opt[:total_power].to_i
      }}
    when 10
      crew = params.require(:crew).permit(
        :ship_type, :captain, :pilot, :astrogator,
        :engineer, :maintenance, :gunner, :administrator,
        :sensor_operator, :medic, :officer,
        :total_crew, :total_salary
      )
      { "crew" => crew.to_h.transform_values { |v|
          v.is_a?(String) && v.match?(/\A\d+\z/) ? v.to_i : v
        }
      }
    when 11
      sr = params.require(:staterooms).permit(
        :standard, :high, :luxury, :low_berths,
        :common_area, :total_tonnage, :total_cost, :total_power
      )
      { "staterooms" => {
        "standard"      => sr[:standard].to_i,
        "high"          => sr[:high].to_i,
        "luxury"        => sr[:luxury].to_i,
        "low_berths"    => sr[:low_berths].to_i,
        "common_area"   => sr[:common_area].to_i,
        "total_tonnage" => sr[:total_tonnage].to_i,
        "total_cost"    => sr[:total_cost].to_i,
        "total_power"   => sr[:total_power].to_i
      }}
    when 12
      cargo = params.require(:cargo).permit(:tonnage, :available)
      { "cargo" => {
        "tonnage"   => cargo[:tonnage].to_i,
        "available" => cargo[:available].to_i
      }}
    else
      {}
    end
  end
end