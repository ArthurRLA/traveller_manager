import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "type", "tonnage",
    "basicPower", "manoeuvrePower", "jumpPower", "totalNeeded",
    "powerPerTon", "powerGenerated", "costPerTon", "totalCost",
    "techLevel", "powerStatus", "powerDiff",
    "costInput", "powerGeneratedInput"
  ]

  static POWER_PLANTS = {
    fission:    { powerPerTon: 8,   costPerTon: 400000,   tl: 6  },
    chemical:   { powerPerTon: 5,   costPerTon: 250000,   tl: 7  },
    fusion_tl8: { powerPerTon: 10,  costPerTon: 500000,   tl: 8  },
    fusion_tl12:{ powerPerTon: 15,  costPerTon: 1000000,  tl: 12 },
    fusion_tl15:{ powerPerTon: 20,  costPerTon: 2000000,  tl: 15 },
    antimatter: { powerPerTon: 100, costPerTon: 10000000, tl: 20 }
  }

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox = document.querySelectorAll(".info-box .result-item span")
    this.hullTonnage = parseInt(infoBox[0]?.textContent) || 0

    const infoBoxEl = document.querySelector(".info-box")
    this.mDrivePower = parseInt(infoBoxEl?.dataset.manoeuvrePower) || 0
    this.jDrivePower = parseInt(infoBoxEl?.dataset.jumpPower)      || 0
  }

  calculate() {
    const type    = this.typeTarget.value
    const tonnage = parseInt(this.tonnageTarget.value) || 0
    const config  = this.constructor.POWER_PLANTS[type]

    const basicPower     = Math.ceil(this.hullTonnage * 0.20)
    const manoeuvrePower = this.mDrivePower
    const jumpPower      = this.jDrivePower
    const totalNeeded    = basicPower + manoeuvrePower

    const powerGenerated = tonnage * config.powerPerTon
    const totalCost      = tonnage * config.costPerTon
    const powerDiff      = powerGenerated - totalNeeded

    this.basicPowerTarget.textContent     = basicPower
    this.manoeuvrePowerTarget.textContent = manoeuvrePower
    this.jumpPowerTarget.textContent      = jumpPower + " (only when jumping)"
    this.totalNeededTarget.textContent    = totalNeeded

    this.powerPerTonTarget.textContent    = config.powerPerTon
    this.powerGeneratedTarget.textContent = powerGenerated
    this.costPerTonTarget.textContent     = "Cr" + config.costPerTon.toLocaleString()
    this.totalCostTarget.textContent      = "Cr" + totalCost.toLocaleString()
    this.techLevelTarget.textContent      = "TL" + config.tl
    this.powerDiffTarget.textContent      = (powerDiff >= 0 ? "+" : "") + powerDiff

    if (powerGenerated >= totalNeeded) {
      this.powerStatusTarget.textContent  = "✓ Sufficient"
      this.powerStatusTarget.style.color  = "green"
    } else {
      this.powerStatusTarget.textContent  = "✗ Insufficient"
      this.powerStatusTarget.style.color  = "red"
    }

    this.costInputTarget.value           = totalCost
    this.powerGeneratedInputTarget.value = powerGenerated
  }
}