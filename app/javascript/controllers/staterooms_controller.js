import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "standard", "high", "luxury", "lowBerths", "commonArea",
    "recommended", "recommendedCommon",
    "totalBerths", "totalTonnage", "totalCost", "totalPower",
    "crewCoverage",
    "totalTonnageInput", "totalCostInput", "totalPowerInput"
  ]

  static STATEROOM_TYPES = {
    standard:  { tons: 4,   cost: 500000,  lifeSupportCost: 2000  },
    high:      { tons: 6,   cost: 800000,  lifeSupportCost: 3000  },
    luxury:    { tons: 10,  cost: 1500000, lifeSupportCost: 5000  },
    low_berth: { tons: 0.5, cost: 50000,   lifeSupportCost: 0     },
    common:    { tons: 1,   cost: 100000,  lifeSupportCost: 0     }
  }

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox    = document.querySelector(".info-box")
    this.totalCrew   = parseInt(infoBox?.dataset.totalCrew) || 0
  }

  calculate() {
    const standard   = parseInt(this.standardTarget.value)   || 0
    const high       = parseInt(this.highTarget.value)       || 0
    const luxury     = parseInt(this.luxuryTarget.value)     || 0
    const lowBerths  = parseInt(this.lowBerthsTarget.value)  || 0
    const commonArea = parseInt(this.commonAreaTarget.value) || 0

    const types = this.constructor.STATEROOM_TYPES

    const standardTons  = standard  * types.standard.tons
    const highTons      = high      * types.high.tons
    const luxuryTons    = luxury    * types.luxury.tons
    const lowBerthTons  = lowBerths * types.low_berth.tons
    const commonTons    = commonArea * types.common.tons

    const stateroomTons = standardTons + highTons + luxuryTons
    const totalTonnage  = stateroomTons + lowBerthTons + commonTons

    const standardCost  = standard  * types.standard.cost
    const highCost      = high      * types.high.cost
    const luxuryCost    = luxury    * types.luxury.cost
    const lowBerthCost  = lowBerths * types.low_berth.cost
    const commonCost    = commonArea * types.common.cost
    const totalCost     = standardCost + highCost + luxuryCost +
                          lowBerthCost + commonCost

    const lowBerthPower = Math.ceil(lowBerths / 10)
    const totalPower    = lowBerthPower

    const recommended        = this.totalCrew
    const recommendedCommon  = Math.ceil(stateroomTons * 0.25)
    const totalBerths        = standard + high + luxury

    let crewCoverageText  = "-"
    let crewCoverageColor = "gray"

    if (this.totalCrew > 0) {
      if (totalBerths >= this.totalCrew) {
        crewCoverageText  = "✓ All crew accommodated"
        crewCoverageColor = "green"
      } else {
        crewCoverageText  = `✗ ${this.totalCrew - totalBerths} crew without staterooms`
        crewCoverageColor = "red"
      }
    }

    this.recommendedTarget.textContent       = recommended
    this.recommendedCommonTarget.textContent = recommendedCommon
    this.totalBerthsTarget.textContent       = totalBerths
    this.totalTonnageTarget.textContent      = totalTonnage + " tons"
    this.totalCostTarget.textContent         = "Cr" + totalCost.toLocaleString()
    this.totalPowerTarget.textContent        = totalPower
    this.crewCoverageTarget.textContent      = crewCoverageText
    this.crewCoverageTarget.style.color      = crewCoverageColor

    this.totalTonnageInputTarget.value = totalTonnage
    this.totalCostInputTarget.value    = totalCost
    this.totalPowerInputTarget.value   = totalPower
  }
}