import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "shipType",
    "captain", "pilot", "astrogator", "engineer",
    "maintenance", "gunner", "administrator",
    "sensorOperator", "medic", "officer", "steward",
    "totalCrew", "totalSalary",
    "captainInput", "pilotInput", "astrogatorInput",
    "engineerInput", "maintenanceInput", "gunnerInput",
    "administratorInput", "sensorOperatorInput",
    "medicInput", "officerInput", "stewardInput",
    "totalCrewInput", "totalSalaryInput", "shipTypeInput",
    "includeMedic", "includeOfficer", "includeSteward",
    "highPassengers", "middlePassengers"
  ]

  static SALARIES = {
    captain:         10000,
    pilot:           6000,
    astrogator:      5000,
    engineer:        4000,
    maintenance:     1000,
    gunner:          2000,
    administrator:   1500,
    sensor_operator: 4000,
    medic:           4000,
    officer:         5000,
    steward:         2000
  }

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox        = document.querySelector(".info-box")
    this.hullTonnage     = parseInt(infoBox?.dataset.hullTonnage)  || 0
    this.driveTonnage    = parseInt(infoBox?.dataset.driveTonnage) || 0
    this.jumpRating      = parseInt(infoBox?.dataset.jumpRating)   || 0

    try {
      this.weaponsData = JSON.parse(infoBox?.dataset.weaponsData || "[]")
    } catch {
      this.weaponsData = []
    }
  }

  countWeaponMounts() {
    const isMilitary = this.shipTypeTarget.value === "military"
    
    return this.weaponsData.reduce((sum, w) => {
      if (isMilitary) {
        if (w.mountType === "small_bay")  return sum + 1
        if (w.mountType === "large_bay")  return sum + 4
        return sum + 2
      } else {
        if (["small_bay", "medium_bay", "large_bay"].includes(w.mountType)) return sum
        return sum + 1
      }
    }, 0)
  }

  calculate() {
    const shipType   = this.shipTypeTarget.value
    const isMilitary = shipType === "military"
    const mounts     = this.countWeaponMounts()

    const captain = 1

    const pilot = isMilitary ? 3 : 1

    const astrogator = this.jumpRating > 0 ? 1 : 0

    const engineer = Math.max(1, Math.ceil(this.driveTonnage / 35))

    let maintenance = 0
    if (this.hullTonnage >= 1000) {
      maintenance = isMilitary
        ? Math.ceil(this.hullTonnage / 500)
        : Math.ceil(this.hullTonnage / 1000)
    }

    const gunner = mounts

    let administrator = 0
    if (this.hullTonnage >= 2000) {
      administrator = isMilitary
        ? Math.ceil(this.hullTonnage / 1000)
        : Math.ceil(this.hullTonnage / 2000)
    }

    let sensorOperator = 0
    if (this.hullTonnage >= 7500) {
      sensorOperator = isMilitary
        ? Math.ceil(this.hullTonnage / 7500) * 3
        : Math.ceil(this.hullTonnage / 7500)
    }

    let steward = 0
    if (this.includeStewardTarget.checked) {
      const highPassengers   = parseInt(this.highPassengersTarget.value)   || 0
      const middlePassengers = parseInt(this.middlePassengersTarget.value) || 0
      steward = Math.ceil(highPassengers / 10) + Math.ceil(middlePassengers / 100)
      steward = Math.max(steward, 1)
    }

    const subtotal = captain + pilot + astrogator + engineer +
                     maintenance + gunner + administrator + sensorOperator + steward

    let medic = 0
    if (this.includeMedicTarget.checked) {
      medic = Math.max(1, Math.ceil(subtotal / 120))
    }

    let officer = 0
    if (this.includeOfficerTarget.checked) {
      officer = isMilitary
        ? Math.ceil(subtotal / 10)
        : Math.ceil(subtotal / 20)
      officer = Math.max(1, officer)
    }

    const totalCrew = subtotal + medic + officer

    const totalSalary =
      (captain        * this.constructor.SALARIES.captain)        +
      (pilot          * this.constructor.SALARIES.pilot)          +
      (astrogator     * this.constructor.SALARIES.astrogator)     +
      (engineer       * this.constructor.SALARIES.engineer)       +
      (maintenance    * this.constructor.SALARIES.maintenance)    +
      (gunner         * this.constructor.SALARIES.gunner)         +
      (administrator  * this.constructor.SALARIES.administrator)  +
      (sensorOperator * this.constructor.SALARIES.sensor_operator)+
      (steward        * this.constructor.SALARIES.steward)        +
      (medic          * this.constructor.SALARIES.medic)          +
      (officer        * this.constructor.SALARIES.officer)

    this.captainTarget.textContent        = captain
    this.pilotTarget.textContent          = pilot
    this.astrogatorTarget.textContent     = astrogator
    this.engineerTarget.textContent       = engineer
    this.maintenanceTarget.textContent    = maintenance
    this.gunnerTarget.textContent         = gunner
    this.administratorTarget.textContent  = administrator
    this.sensorOperatorTarget.textContent = sensorOperator
    this.stewardTarget.textContent        = steward
    this.medicTarget.textContent          = medic
    this.officerTarget.textContent        = officer
    this.totalCrewTarget.textContent      = totalCrew
    this.totalSalaryTarget.textContent    = totalSalary.toLocaleString()

    this.captainInputTarget.value        = captain
    this.pilotInputTarget.value          = pilot
    this.astrogatorInputTarget.value     = astrogator
    this.engineerInputTarget.value       = engineer
    this.maintenanceInputTarget.value    = maintenance
    this.gunnerInputTarget.value         = gunner
    this.administratorInputTarget.value  = administrator
    this.sensorOperatorInputTarget.value = sensorOperator
    this.stewardInputTarget.value        = steward
    this.medicInputTarget.value          = medic
    this.officerInputTarget.value        = officer
    this.totalCrewInputTarget.value      = totalCrew
    this.totalSalaryInputTarget.value    = totalSalary
    this.shipTypeInputTarget.value       = shipType
  }
}