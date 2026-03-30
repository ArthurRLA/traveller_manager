import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "standard", "doubleOccupancy", "high", "luxury",
    "lowBerths", "emergencyLowBerths", "commonArea",
    "recommendedCommon",
    "standardBerths", "doubleBerths", "highBerths", "luxuryBerths",
    "totalCapacity", "totalPeopleAboard",
    "totalTonnage", "totalCost", "totalPower", "crewCoverage",
    "totalTonnageInput", "totalCostInput",
    "totalPowerInput", "totalCapacityInput"
  ]

  static TYPES = {
    standard:          { tons: 4,   cost: 500000,  power: 0,    capacity: 1 },
    double_occupancy:  { tons: 4,   cost: 500000,  power: 0,    capacity: 2 },
    high:              { tons: 6,   cost: 800000,  power: 0,    capacity: 1 },
    luxury:            { tons: 10,  cost: 1500000, power: 0,    capacity: 1 },
    low_berth:         { tons: 0.5, cost: 50000,   power: 0.1,  capacity: 1 },
    emergency_berth:   { tons: 1,   cost: 1000000, power: 1,    capacity: 4 },
    common:            { tons: 1,   cost: 100000,  power: 0,    capacity: 0 }
  }

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox          = document.querySelector(".info-box")
    this.totalCrew         = parseInt(infoBox?.dataset.totalCrew)         || 0
    this.highPassengers    = parseInt(infoBox?.dataset.highPassengers)    || 0
    this.middlePassengers  = parseInt(infoBox?.dataset.middlePassengers)  || 0
    this.totalPeopleAboard = this.totalCrew + this.highPassengers + this.middlePassengers
  }

  calculate() {
    const standard         = parseInt(this.standardTarget.value)         || 0
    const doubleOccupancy  = parseInt(this.doubleOccupancyTarget.value)  || 0
    const high             = parseInt(this.highTarget.value)             || 0
    const luxury           = parseInt(this.luxuryTarget.value)           || 0
    const lowBerths        = parseInt(this.lowBerthsTarget.value)        || 0
    const emergencyBerths  = parseInt(this.emergencyLowBerthsTarget.value) || 0
    const commonArea       = parseInt(this.commonAreaTarget.value)       || 0

    const t = this.constructor.TYPES

    const standardTons   = standard        * t.standard.tons
    const doubleTons     = doubleOccupancy  * t.double_occupancy.tons
    const highTons       = high             * t.high.tons
    const luxuryTons     = luxury           * t.luxury.tons
    const lowBerthTons   = lowBerths        * t.low_berth.tons
    const emergencyTons  = emergencyBerths  * t.emergency_berth.tons
    const commonTons     = commonArea       * t.common.tons

    const stateroomTons = standardTons + doubleTons + highTons + luxuryTons
    const totalTonnage  = stateroomTons + lowBerthTons + emergencyTons + commonTons

    const totalCost =
      (standard        * t.standard.cost)         +
      (doubleOccupancy  * t.double_occupancy.cost) +
      (high             * t.high.cost)             +
      (luxury           * t.luxury.cost)           +
      (lowBerths        * t.low_berth.cost)        +
      (emergencyBerths  * t.emergency_berth.cost)  +
      (commonArea       * t.common.cost)

    const lowBerthPower     = Math.ceil(lowBerths / 10)
    const emergencyPower    = emergencyBerths * t.emergency_berth.power
    const totalPower        = lowBerthPower + emergencyPower

    const standardCapacity  = standard        * t.standard.capacity
    const doubleCapacity    = doubleOccupancy  * t.double_occupancy.capacity
    const highCapacity      = high             * t.high.capacity
    const luxuryCapacity    = luxury           * t.luxury.capacity
    const totalCapacity     = standardCapacity + doubleCapacity +
                              highCapacity     + luxuryCapacity

    const recommendedCommon = Math.ceil(stateroomTons * 0.25)

    let crewCoverageText  = "-"
    let crewCoverageColor = "gray"

    if (this.totalPeopleAboard > 0) {
      const diff = totalCapacity - this.totalPeopleAboard
      if (diff >= 0) {
        crewCoverageText  = `✓ ${totalCapacity} berths for ${this.totalPeopleAboard} people (${diff} spare)`
        crewCoverageColor = "green"
      } else {
        crewCoverageText  = `✗ ${Math.abs(diff)} people without staterooms`
        crewCoverageColor = "red"
      }
    }

    this.totalPeopleAboardTarget.textContent  = this.totalPeopleAboard
    this.recommendedCommonTarget.textContent  = recommendedCommon
    this.standardBerthsTarget.textContent     = standardCapacity
    this.doubleBerthsTarget.textContent       = doubleCapacity
    this.highBerthsTarget.textContent         = highCapacity
    this.luxuryBerthsTarget.textContent       = luxuryCapacity
    this.totalCapacityTarget.textContent      = totalCapacity
    this.totalTonnageTarget.textContent       = totalTonnage + " tons"
    this.totalCostTarget.textContent          = "Cr" + totalCost.toLocaleString()
    this.totalPowerTarget.textContent         = totalPower
    this.crewCoverageTarget.textContent       = crewCoverageText
    this.crewCoverageTarget.style.color       = crewCoverageColor

    this.totalTonnageInputTarget.value  = totalTonnage
    this.totalCostInputTarget.value     = totalCost
    this.totalPowerInputTarget.value    = totalPower
    this.totalCapacityInputTarget.value = totalCapacity
  }
}