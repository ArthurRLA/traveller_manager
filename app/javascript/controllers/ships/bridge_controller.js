import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "type", "holographic",
    "requiredSize", "baseCost",
    "tonnage", "finalCost", "dmNotes",
    "tonnageInput", "costInput"
  ]

  static BRIDGE_SIZES = [
    { maxTonnage: 50,     bridgeSize: 3  },
    { maxTonnage: 99,     bridgeSize: 6  },
    { maxTonnage: 200,    bridgeSize: 10 },
    { maxTonnage: 1000,   bridgeSize: 20 },
    { maxTonnage: 2000,   bridgeSize: 40 },
    { maxTonnage: 100000, bridgeSize: 60 }
  ]

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox    = document.querySelector(".info-box")
    this.hullTonnage = parseInt(infoBox?.dataset.hullTonnage) || 0
  }

  getRequiredBridgeSize() {
    if (this.hullTonnage > 100000) {
      const extra = Math.floor(this.hullTonnage / 100000) - 1
      return 60 + (extra * 20)
    }

    for (const entry of this.constructor.BRIDGE_SIZES) {
      if (this.hullTonnage <= entry.maxTonnage) {
        return entry.bridgeSize
      }
    }
    return 60
  }

  getBaseCost() {
    return Math.ceil(this.hullTonnage / 100) * 500000
  }

  calculate() {
    const type         = this.typeTarget.value
    const holographic  = this.holographicTarget.checked
    const requiredSize = this.getRequiredBridgeSize()
    const baseCost     = this.getBaseCost()

    let tonnage  = requiredSize
    let cost     = baseCost
    let dmNotes  = "No modifiers"

    switch(type) {
      case "smaller":
        tonnage  = Math.max(Math.floor(requiredSize / 2), 3)
        cost     = Math.floor(baseCost / 2)
        dmNotes  = "DM-1 to all spacecraft operations"
        break
      case "command":
        if (this.hullTonnage > 5000) {
          tonnage  = requiredSize + 40
          cost     = baseCost + 30000000
          dmNotes  = "DM+1 to Tactics (naval)"
        } else {
          dmNotes  = "⚠ Command Bridge requires ship over 5,000 tons"
        }
        break
    }

    if (holographic) {
      cost     = Math.floor(cost * 1.25)
      dmNotes  += " | DM+2 to initiative"
    }

    this.requiredSizeTarget.textContent = requiredSize
    this.baseCostTarget.textContent     = baseCost.toLocaleString()
    this.tonnageTarget.textContent      = tonnage + " tons"
    this.finalCostTarget.textContent    = "Cr" + cost.toLocaleString()
    this.dmNotesTarget.textContent      = dmNotes

    this.tonnageInputTarget.value = tonnage
    this.costInputTarget.value    = cost
  }
}