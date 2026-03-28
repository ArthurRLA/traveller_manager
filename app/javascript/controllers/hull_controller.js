import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "tonnage", "configuration",
    "baseCost", "finalCost", "hullPoints", "streamlined",
    "costInput", "hullPointsInput"
  ]

  static CONFIGURATIONS = {
    standard:            { costMultiplier: 1.00, hullPointMultiplier: 1.00, streamlined: "Partial" },
    streamlined:         { costMultiplier: 1.20, hullPointMultiplier: 1.00, streamlined: "Yes"     },
    sphere:              { costMultiplier: 1.10, hullPointMultiplier: 1.00, streamlined: "Partial" },
    close_structure:     { costMultiplier: 0.80, hullPointMultiplier: 1.00, streamlined: "Partial" },
    dispersed_structure: { costMultiplier: 0.50, hullPointMultiplier: 0.90, streamlined: "No"      },
    planetoid:           { costMultiplier: null, hullPointMultiplier: 1.25, streamlined: "No"      },
    buffered_planetoid:  { costMultiplier: null, hullPointMultiplier: 1.50, streamlined: "No"      }
  }

  connect() {
    this.calculate()
  }

  calculate() {
    const tonnage       = parseInt(this.tonnageTarget.value)       || 0
    const configuration = this.configurationTarget.value

    const config  = this.constructor.CONFIGURATIONS[configuration]
    const baseCost = tonnage * 50000

    let hullPoints
    if (tonnage >= 100000) {
      hullPoints = Math.floor(tonnage / 1.5)
    } else if (tonnage >= 25000) {
      hullPoints = Math.floor(tonnage / 2)
    } else {
      hullPoints = Math.floor(tonnage / 2.5)
    }

    hullPoints = Math.floor(hullPoints * config.hullPointMultiplier)

    let finalCost
    if (config.costMultiplier === null) {
      finalCost = tonnage * 4000
    } else {
      finalCost = Math.floor(baseCost * config.costMultiplier)
    }

    this.baseCostTarget.textContent    = "Cr" + baseCost.toLocaleString()
    this.finalCostTarget.textContent   = "Cr" + finalCost.toLocaleString()
    this.hullPointsTarget.textContent  = hullPoints
    this.streamlinedTarget.textContent = config.streamlined

    this.costInputTarget.value        = finalCost
    this.hullPointsInputTarget.value  = hullPoints
  }
}