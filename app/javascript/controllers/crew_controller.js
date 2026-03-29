import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "shipType",
    "captain", "pilot", "astrogator", "engineer",
    "maintenance", "gunner", "administrator",
    "sensorOperator", "medic", "officer",
    "totalCrew", "totalSalary",
    "captainInput", "pilotInput", "astrogatorInput",
    "engineerInput", "maintenanceInput", "gunnerInput",
    "administratorInput", "sensorOperatorInput",
    "medicInput", "officerInput",
    "totalCrewInput", "totalSalaryInput", "shipTypeInput"
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
    officer:         5000
  }

  connect() {
    this.loadShipData()
    this.calculate()
  }

  loadShipData() {
    const infoBox        = document.querySelector(".info-box")
    this.hullTonnage     = parseInt(infoBox?.dataset.hullTonnage)    || 0
    this.driveTonnage    = parseInt(infoBox?.dataset.driveTonnage)   || 0
    this.jumpRating      = parseInt(infoBox?.dataset.jumpRating)     || 0

    try {
      this.weaponsData = JSON.parse(infoBox?.dataset.weaponsData || "[]")
    } catch {
      this.weaponsData = []
    }
  }

  countWeaponMounts() {
    return this.weaponsData.reduce((sum, w) => {
      // Bay weapons need more crew on military ships
      if (["small_bay", "medium_bay", "large_bay"].includes(w.mountType)) {
        return sum + 1
      }
      return sum + 1
    }, 0)
  }

  calculate() {
    const shipType    = this.shipTypeTarget.value
    const isMilitary  = shipType === "military"
    const mounts      = this.countWeaponMounts()

    const captain    = 1
    const pilot      = isMilitary ? 3 : 1
    const astrogator = this.jumpRating > 0 ? 1 : 0
    const engineer   = Math.max(1, Math.ceil(this.driveTonnage / 35))

    const maintenance = isMilitary
      ? Math.ceil(this.hullTonnage / 500)
      : Math.ceil(this.hullTonnage / 1000)

    const gunner = isMilitary
      ? mounts * 2
      : mounts

    const administrator = isMilitary
      ? Math.ceil(this.hullTonnage / 1000)
      : Math.ceil(this.hullTonnage / 2000)

    const sensorOperator = isMilitary
      ? Math.ceil(this.hullTonnage / 7500) * 3
      : Math.ceil(this.hullTonnage / 7500)

    const subtotal = captain + pilot + astrogator + engineer +
                     maintenance + gunner + administrator + sensorOperator

    const medic  = Math.ceil(subtotal / 120)
    const officer = isMilitary
      ? Math.ceil(subtotal / 10)
      : Math.ceil(subtotal / 20)

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
    this.medicInputTarget.value          = medic
    this.officerInputTarget.value        = officer
    this.totalCrewInputTarget.value      = totalCrew
    this.totalSalaryInputTarget.value    = totalSalary
    this.shipTypeInputTarget.value       = shipType
  }
}