import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "jumpFuel", "powerFuel",
    "jumpFuelRequired", "powerFuelRequired",
    "totalFuel", "jumpFuelStatus", "powerFuelStatus",
    "totalFuelInput"
  ]

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox          = document.querySelector(".info-box")
    this.hullTonnage       = parseInt(infoBox?.dataset.hullTonnage)        || 0
    this.jumpRating        = parseInt(infoBox?.dataset.jumpRating)         || 0
    this.powerPlantTonnage = parseInt(infoBox?.dataset.powerPlantTonnage)  || 0
    this.powerPlantType    = infoBox?.dataset.powerPlantType               || ""
  }

  calculate() {
    const jumpFuel  = parseInt(this.jumpFuelTarget.value)  || 0
    const powerFuel = parseInt(this.powerFuelTarget.value) || 0

    const jumpFuelRequired = Math.ceil(this.hullTonnage * 0.10 * this.jumpRating)

    let powerFuelRequired
    if (this.powerPlantType === "chemical") {
      powerFuelRequired = this.powerPlantTonnage * 10
    } else {
      powerFuelRequired = Math.ceil(this.powerPlantTonnage * 0.10)
    }

    const totalFuel = jumpFuel + powerFuel

    this.jumpFuelRequiredTarget.textContent  = jumpFuelRequired
    this.powerFuelRequiredTarget.textContent = powerFuelRequired

    this.totalFuelTarget.textContent = totalFuel + " tons"

    if (this.jumpRating === 0) {
      this.jumpFuelStatusTarget.textContent = "N/A (no jump drive)"
      this.jumpFuelStatusTarget.style.color = "gray"
    } else if (jumpFuel >= jumpFuelRequired) {
      this.jumpFuelStatusTarget.textContent = "✓ Sufficient"
      this.jumpFuelStatusTarget.style.color = "green"
    } else {
      this.jumpFuelStatusTarget.textContent = "✗ Insufficient"
      this.jumpFuelStatusTarget.style.color = "red"
    }

    if (powerFuel >= powerFuelRequired) {
      this.powerFuelStatusTarget.textContent = "✓ Sufficient"
      this.powerFuelStatusTarget.style.color = "green"
    } else {
      this.powerFuelStatusTarget.textContent = "✗ Insufficient"
      this.powerFuelStatusTarget.style.color = "red"
    }

    this.totalFuelInputTarget.value = totalFuel
  }
}