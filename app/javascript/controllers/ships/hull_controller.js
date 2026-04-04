import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "tonnage", "configuration",
    "specialisedType",
    "additionalType", "additionalTypePercent",
    "armourType", "armourValue", "armourMax", "armourTonnagePerPoint",
    "heatShielding", "radiationShielding", "reflec", "solarCoating", "stealthType",
    "baseCost", "configModifier", "specialisedCost",
    "armourCost", "armourTonnage",
    "optionsCost", "stealthTonnage",
    "hullPoints", "streamlined", "finalCost", "warnings",
    "costInput", "hullPointsInput", "armourTonnageInput", "stealthTonnageInput"
  ]

  static CONFIGURATIONS = {
    standard:            { costMultiplier: 1.00, hullPointMultiplier: 1.00, armourVolumeModifier: 1.00, streamlined: "Partial" },
    streamlined:         { costMultiplier: 1.20, hullPointMultiplier: 1.00, armourVolumeModifier: 1.20, streamlined: "Yes"     },
    sphere:              { costMultiplier: 1.10, hullPointMultiplier: 1.00, armourVolumeModifier: 0.90, streamlined: "Partial" },
    close_structure:     { costMultiplier: 0.80, hullPointMultiplier: 1.00, armourVolumeModifier: 1.50, streamlined: "Partial" },
    dispersed_structure: { costMultiplier: 0.50, hullPointMultiplier: 0.90, armourVolumeModifier: 2.00, streamlined: "No"      },
    planetoid:           { costMultiplier: null, hullPointMultiplier: 1.25, armourVolumeModifier: 1.00, streamlined: "No", baseArmour: 2  },
    buffered_planetoid:  { costMultiplier: null, hullPointMultiplier: 1.50, armourVolumeModifier: 1.00, streamlined: "No", baseArmour: 4  }
  }

  static SPECIALISED = {
    none:        { costMultiplier: 1.00, hullPointMultiplier: 1.00 },
    reinforced:  { costMultiplier: 1.50, hullPointMultiplier: 1.10 },
    light:       { costMultiplier: 0.75, hullPointMultiplier: 0.90 },
    military:    { costMultiplier: 1.25, hullPointMultiplier: 1.00 },
    non_gravity: { costMultiplier: 0.50, hullPointMultiplier: 1.00 }
  }

  static ARMOUR = {
    none:             { tonPerPoint: 0,      costPerTon: 0,        tl: 0,  maxProtection: (tl) => 0         },
    titanium_steel:   { tonPerPoint: 0.025,  costPerTon: 50000,    tl: 7,  maxProtection: (tl) => Math.min(tl, 9)  },
    crystaliron:      { tonPerPoint: 0.0125, costPerTon: 200000,   tl: 10, maxProtection: (tl) => Math.min(tl, 13) },
    bonded_superdense:{ tonPerPoint: 0.008,  costPerTon: 500000,   tl: 14, maxProtection: (tl) => tl               },
    molecular_bonded: { tonPerPoint: 0.005,  costPerTon: 1500000,  tl: 16, maxProtection: (tl) => tl + 4           }
  }

  static STEALTH = {
    none:     { costPerTon: 0,        tonPercent: 0,    dm: 0  },
    basic:    { costPerTon: 40000,    tonPercent: 0.02, dm: -2 },
    improved: { costPerTon: 100000,   tonPercent: 0,    dm: -2 },
    enhanced: { costPerTon: 500000,   tonPercent: 0,    dm: -4 },
    advanced: { costPerTon: 1000000,  tonPercent: 0,    dm: -6 }
  }

  static ARMOUR_TONNAGE_MULTIPLIER = [
    { maxTons: 15,  multiplier: 4 },
    { maxTons: 25,  multiplier: 3 },
    { maxTons: 99,  multiplier: 2 },
    { maxTons: Infinity, multiplier: 1 }
  ]

  connect() {
    this.calculate()
    this.toggleAdditionalHullDetails()
  }

  toggleAdditionalHullDetails() {
    const type = this.additionalTypeTarget.value
    const details = document.getElementById("additional-hull-details")
    if (details) {
      details.style.display = type !== "none" ? "block" : "none"
    }
  }

  getArmourTonnageMultiplier(tonnage) {
    for (const entry of this.constructor.ARMOUR_TONNAGE_MULTIPLIER) {
      if (tonnage <= entry.maxTons) return entry.multiplier
    }
    return 1
  }

  calculate() {
    this.toggleAdditionalHullDetails()

    const tonnage          = parseInt(this.tonnageTarget.value)           || 0
    const configuration    = this.configurationTarget.value
    const specialisedType  = this.specialisedTypeTarget.value
    const additionalType   = this.additionalTypeTarget.value
    const additionalPct    = parseInt(this.additionalTypePercentTarget.value) || 0
    const armourType       = this.armourTypeTarget.value
    const armourValue      = parseInt(this.armourValueTarget.value)       || 0
    const heatShielding    = this.heatShieldingTarget.checked
    const radShielding     = this.radiationShieldingTarget.checked
    const reflec           = this.reflecTarget.checked
    const solarCoating     = this.solarCoatingTarget.checked
    const stealthType      = this.stealthTypeTarget.value

    const config      = this.constructor.CONFIGURATIONS[configuration]
    const specialised = this.constructor.SPECIALISED[specialisedType]
    const armour      = this.constructor.ARMOUR[armourType]
    const stealth     = this.constructor.STEALTH[stealthType]

    const assumedTL = 15

    let baseCost
    if (config.costMultiplier === null) {
      baseCost = tonnage * 4000
    } else {
      baseCost = tonnage * 50000
    }

    let configCost
    if (config.costMultiplier === null) {
      configCost = baseCost
    } else {
      configCost = Math.floor(baseCost * config.costMultiplier)
    }

    const configModifierText = config.costMultiplier === null
      ? "Special (Cr4,000/ton)"
      : `×${config.costMultiplier.toFixed(2)}`

    const specialisedCost = Math.floor(configCost * specialised.costMultiplier)

    let baseHullPoints
    if (tonnage >= 100000) {
      baseHullPoints = Math.floor(tonnage / 1.5)
    } else if (tonnage >= 25000) {
      baseHullPoints = Math.floor(tonnage / 2)
    } else {
      baseHullPoints = Math.floor(tonnage / 2.5)
    }

    const hullPoints = Math.floor(
      baseHullPoints * config.hullPointMultiplier * specialised.hullPointMultiplier
    )

    let additionalCost = 0
    if (additionalType === "double_hull") {
      additionalCost = Math.floor(specialisedCost * (additionalPct / 100))
    } else if (additionalType === "hamster_cage") {
      additionalCost = Math.floor(specialisedCost * (additionalPct * 2 / 100))
    } else if (additionalType === "breakaway") {
      const breakawayTons = Math.ceil(tonnage * 0.02)
      additionalCost = breakawayTons * 2000000
    }

    const hullCostAfterAdditional = specialisedCost + additionalCost

    const armourTonnageMultiplier = this.getArmourTonnageMultiplier(tonnage)
    const armourVolumeModifier    = config.armourVolumeModifier
    const maxArmour               = armour.maxProtection(assumedTL)

    const effectiveArmourValue = Math.min(armourValue, maxArmour)

    const armourTonsPerPoint = armour.tonPerPoint * tonnage * armourVolumeModifier * armourTonnageMultiplier
    const totalArmourTons    = Math.ceil(armourTonsPerPoint * effectiveArmourValue)
    const armourCost         = totalArmourTons * armour.costPerTon

    let optionsCost = 0

    if (heatShielding)  optionsCost += Math.floor(tonnage * 100000)        
    if (radShielding)   optionsCost += tonnage * 25000                     
    if (reflec)         optionsCost += Math.floor(tonnage * 100000)        
    if (solarCoating)   optionsCost += 0                                   

    const stealthTons = Math.ceil(tonnage * stealth.tonPercent)
    const stealthCost = tonnage * stealth.costPerTon

    optionsCost += stealthCost

    const finalCost = hullCostAfterAdditional + armourCost + optionsCost

    const warnings = []

    if (specialisedType === "military" && tonnage < 5000) {
      warnings.push("⚠ Military Hull requires capital ship (5,000+ tons)")
    }
    if (specialisedType === "non_gravity" && tonnage > 500000) {
      warnings.push("⚠ Non-Gravity Hull limited to 500,000 tons")
    }
    if (reflec && stealthType !== "none") {
      warnings.push("⚠ Reflec cannot be combined with Stealth")
    }
    if (solarCoating && (heatShielding || radShielding || reflec || stealthType !== "none")) {
      warnings.push("⚠ Solar Coating cannot be combined with other hull options (except Radiation Shielding)")
    }
    if (armourValue > maxArmour && armourType !== "none") {
      warnings.push(`⚠ Armour capped at ${maxArmour} for this armour type (assumed TL15)`)
    }
    if (tonnage < 100 && this.jumpRatingNeeded) {
      warnings.push("⚠ Jump-capable ships must be at least 100 tons")
    }

    this.baseCostTarget.textContent              = "Cr" + baseCost.toLocaleString()
    this.configModifierTarget.textContent        = configModifierText
    this.specialisedCostTarget.textContent       = "Cr" + specialisedCost.toLocaleString()
    this.armourCostTarget.textContent            = "Cr" + armourCost.toLocaleString()
    this.armourTonnageTarget.textContent         = totalArmourTons + " tons"
    this.optionsCostTarget.textContent           = "Cr" + optionsCost.toLocaleString()
    this.stealthTonnageTarget.textContent        = stealthTons + " tons"
    this.hullPointsTarget.textContent            = hullPoints
    this.streamlinedTarget.textContent           = config.streamlined
    this.finalCostTarget.textContent             = "Cr" + finalCost.toLocaleString()
    this.armourMaxTarget.textContent             = maxArmour
    this.armourTonnagePerPointTarget.textContent = (armour.tonPerPoint * 100).toFixed(3) + "%"
    this.warningsTarget.textContent              = warnings.length > 0 ? warnings.join(" | ") : "None"

    this.costInputTarget.value           = finalCost
    this.hullPointsInputTarget.value     = hullPoints
    this.armourTonnageInputTarget.value  = totalArmourTons
    this.stealthTonnageInputTarget.value = stealthTons
  }
}