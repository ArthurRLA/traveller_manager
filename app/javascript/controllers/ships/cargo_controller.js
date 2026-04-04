import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "cargoTonnage",
    "totalUsed", "availableCargo", "maxCargo",
    "cargoAllocated", "unallocated", "spaceStatus",
    "availableInput"
  ]

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox = document.querySelector(".info-box")

    this.hullTonnage      = parseInt(infoBox?.dataset.hullTonnage)      || 0
    this.drivesTonnage    = parseInt(infoBox?.dataset.drivesTonnage)    || 0
    this.powerTonnage     = parseInt(infoBox?.dataset.powerPlantTonnage)|| 0
    this.fuelTonnage      = parseInt(infoBox?.dataset.fuelTonnage)      || 0
    this.bridgeTonnage    = parseInt(infoBox?.dataset.bridgeTonnage)    || 0
    this.sensorsTonnage   = parseInt(infoBox?.dataset.sensorsTonnage)   || 0
    this.weaponsTonnage   = parseInt(infoBox?.dataset.weaponsTonnage)   || 0
    this.optionalTonnage  = parseInt(infoBox?.dataset.optionalTonnage)  || 0
    this.stateroomTonnage = parseInt(infoBox?.dataset.stateroomsTonnage)|| 0

    this.totalUsed = this.drivesTonnage   +
                     this.powerTonnage    +
                     this.fuelTonnage     +
                     this.bridgeTonnage   +
                     this.sensorsTonnage  +
                     this.weaponsTonnage  +
                     this.optionalTonnage +
                     this.stateroomTonnage

    this.availableCargo = this.hullTonnage - this.totalUsed
  }

  calculate() {
    const cargoTonnage  = parseInt(this.cargoTonnageTarget.value) || 0
    const unallocated   = this.availableCargo - cargoTonnage

    this.totalUsedTarget.textContent      = this.totalUsed
    this.availableCargoTarget.textContent = this.availableCargo
    this.maxCargoTarget.textContent       = this.availableCargo
    this.cargoAllocatedTarget.textContent = cargoTonnage + " tons"
    this.unallocatedTarget.textContent    = unallocated + " tons"

    if (unallocated < 0) {
      this.spaceStatusTarget.textContent = "✗ Over capacity by " + Math.abs(unallocated) + " tons"
      this.spaceStatusTarget.style.color = "red"
    } else if (unallocated === 0) {
      this.spaceStatusTarget.textContent = "✓ Perfectly allocated"
      this.spaceStatusTarget.style.color = "green"
    } else {
      this.spaceStatusTarget.textContent = unallocated + " tons unallocated"
      this.spaceStatusTarget.style.color = "orange"
    }

    this.availableInputTarget.value = this.availableCargo
  }
}