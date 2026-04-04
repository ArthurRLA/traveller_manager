import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "primaryModel", "primaryBis", "primaryFib",
    "backupModel",
    "primaryProcessing", "primaryCost",
    "backupProcessing",  "backupCost",
    "totalCost", "backupValid",
    "primaryCostInput", "backupCostInput", "totalCostInput"
  ]

  static COMPUTERS = {
    computer_5:  { processing: 5,   baseCost: 30000,      tl: 7,  isCore: false },
    computer_10: { processing: 10,  baseCost: 160000,     tl: 9,  isCore: false },
    computer_15: { processing: 15,  baseCost: 2000000,    tl: 11, isCore: false },
    computer_20: { processing: 20,  baseCost: 5000000,    tl: 12, isCore: false },
    computer_25: { processing: 25,  baseCost: 10000000,   tl: 13, isCore: false },
    computer_30: { processing: 30,  baseCost: 20000000,   tl: 14, isCore: false },
    computer_35: { processing: 35,  baseCost: 30000000,   tl: 15, isCore: false },
    core_40:     { processing: 40,  baseCost: 45000000,   tl: 9,  isCore: true  },
    core_50:     { processing: 50,  baseCost: 60000000,   tl: 10, isCore: true  },
    core_60:     { processing: 60,  baseCost: 75000000,   tl: 11, isCore: true  },
    core_70:     { processing: 70,  baseCost: 80000000,   tl: 12, isCore: true  },
    core_80:     { processing: 80,  baseCost: 95000000,   tl: 13, isCore: true  },
    core_90:     { processing: 90,  baseCost: 120000000,  tl: 14, isCore: true  },
    core_100:    { processing: 100, baseCost: 130000000,  tl: 15, isCore: true  }
  }

  connect() {
    this.calculate()
  }

  calculateComputerCost(model, bis, fib) {
    const config  = this.constructor.COMPUTERS[model]
    if (!config) return { cost: 0, processing: 0 }

    let cost = config.baseCost
    let multiplier = 1.0

    if (bis && fib) {
      multiplier = 2.0
    } else if (bis || fib) {
      multiplier = 1.5
    }

    return {
      cost:       Math.floor(cost * multiplier),
      processing: config.processing,
      tl:         config.tl,
      isCore:     config.isCore
    }
  }

  calculate() {
    const primaryModel = this.primaryModelTarget.value
    const primaryBis   = this.primaryBisTarget.checked
    const primaryFib   = this.primaryFibTarget.checked
    const backupModel  = this.backupModelTarget.value

    const primary = this.calculateComputerCost(primaryModel, primaryBis, primaryFib)

    let backupProcessingText = "-"
    let backupCostValue      = 0
    let backupValidText      = "-"
    let backupValidColor     = "gray"

    if (backupModel !== "none") {
      const backup = this.calculateComputerCost(backupModel, false, false)
      backupCostValue      = backup.cost
      backupProcessingText = backup.processing

      if (backup.processing < primary.processing) {
        backupValidText  = "✓ Valid"
        backupValidColor = "green"
      } else {
        backupValidText  = "✗ Must be lower than primary"
        backupValidColor = "red"
      }
    }

    const totalCost = primary.cost + backupCostValue

    this.primaryProcessingTarget.textContent = primary.processing
    this.primaryCostTarget.textContent       = "Cr" + primary.cost.toLocaleString()
    this.backupProcessingTarget.textContent  = backupProcessingText
    this.backupCostTarget.textContent        = "Cr" + backupCostValue.toLocaleString()
    this.totalCostTarget.textContent         = "Cr" + totalCost.toLocaleString()
    this.backupValidTarget.textContent       = backupValidText
    this.backupValidTarget.style.color       = backupValidColor

    this.primaryCostInputTarget.value = primary.cost
    this.backupCostInputTarget.value  = backupCostValue
    this.totalCostInputTarget.value   = totalCost
  }
}