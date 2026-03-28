import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "type",
    "suite", "dm", "tonnage", "power", "cost",
    "tonnageInput", "costInput", "powerInput", "dmInput"
  ]

  static SENSORS = {
    basic: {
      suite:   "Lidar, Radar",
      dm:      -4,
      tonnage: 0,
      power:   0,
      cost:    0
    },
    civilian: {
      suite:   "Lidar, Radar",
      dm:      -2,
      tonnage: 1,
      power:   1,
      cost:    3000000
    },
    military: {
      suite:   "Jammers, Lidar, Radar",
      dm:      0,
      tonnage: 2,
      power:   2,
      cost:    4100000
    },
    improved: {
      suite:   "Densitometer, Jammers, Lidar, Radar",
      dm:      1,
      tonnage: 3,
      power:   4,
      cost:    4300000
    },
    advanced: {
      suite:   "Densitometer, Jammers, Lidar, Neural Activity Sensor, Radar",
      dm:      2,
      tonnage: 5,
      power:   6,
      cost:    5300000
    }
  }

  connect() {
    this.calculate()
  }

  calculate() {
    const type   = this.typeTarget.value
    const config = this.constructor.SENSORS[type]

    const dmText = config.dm === 0 ? "+0" :
                   config.dm > 0   ? "+" + config.dm :
                   config.dm.toString()

    this.suiteTarget.textContent   = config.suite
    this.dmTarget.textContent      = dmText
    this.tonnageTarget.textContent = config.tonnage === 0 ? "Included in bridge" :
                                     config.tonnage + " tons"
    this.powerTarget.textContent   = config.power
    this.costTarget.textContent    = config.cost === 0 ? "Free" :
                                     "Cr" + config.cost.toLocaleString()

    this.tonnageInputTarget.value = config.tonnage
    this.costInputTarget.value    = config.cost
    this.powerInputTarget.value   = config.power
    this.dmInputTarget.value      = config.dm
  }
}