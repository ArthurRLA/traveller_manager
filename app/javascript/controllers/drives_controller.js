import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "manoeuvreRating", "jumpRating",
    "maneuverTonnage", "maneuverCost", "maneuverPower", "maneuverTL",
    "jumpTonnage",     "jumpCost",     "jumpPower",     "jumpTL",
    "maneuverTonnageInput", "maneuverCostInput", "maneuverPowerInput",
    "jumpTonnageInput",     "jumpCostInput",     "jumpPowerInput",
    "totalTonnage", "remainingTonnage", "totalCost", "totalPower"
  ]

  static MANOEUVRE = {
    0:  { percent: 0.005, tl: 9  },
    1:  { percent: 0.01,  tl: 9  },
    2:  { percent: 0.02,  tl: 10 },
    3:  { percent: 0.03,  tl: 10 },
    4:  { percent: 0.04,  tl: 11 },
    5:  { percent: 0.05,  tl: 11 },
    6:  { percent: 0.06,  tl: 12 },
    7:  { percent: 0.07,  tl: 13 },
    8:  { percent: 0.08,  tl: 14 },
    9:  { percent: 0.09,  tl: 15 },
    10: { percent: 0.10,  tl: 16 },
    11: { percent: 0.11,  tl: 17 }
  }

  static JUMP = {
    1: { percent: 0.025, tl: 9  },
    2: { percent: 0.05,  tl: 11 },
    3: { percent: 0.075, tl: 12 },
    4: { percent: 0.10,  tl: 13 },
    5: { percent: 0.125, tl: 14 },
    6: { percent: 0.15,  tl: 15 },
    7: { percent: 0.175, tl: 16 },
    8: { percent: 0.20,  tl: 17 },
    9: { percent: 0.225, tl: 18 }
  }

  connect() {
    this.hullTonnage = parseInt(
      document.querySelector("[data-hull-tonnage]")?.dataset.hullTonnage
    ) || this.getHullTonnageFromPage()

    this.calculate()
  }

  getHullTonnageFromPage() {
    const text = document.querySelector(".info-box strong")?.textContent || "0"
    return parseInt(text) || 0
  }

  calculate() {
    const tonnage      = this.hullTonnage
    const mRating      = parseInt(this.manoeuvreRatingTarget.value) || 0
    const jRating      = parseInt(this.jumpRatingTarget.value)      || 0

    const mConfig      = this.constructor.MANOEUVRE[mRating]
    const mTonnage     = Math.ceil(tonnage * mConfig.percent)
    const mCost        = mTonnage * 2000000 
    const mPower       = tonnage * 0.1 * (mRating === 0 ? 0.25 : mRating)

    let jTonnage = 0
    let jCost    = 0
    let jPower   = 0
    let jTLText  = "-"

    if (jRating > 0) {
      const jConfig = this.constructor.JUMP[jRating]
      jTonnage      = Math.ceil((tonnage * jConfig.percent) + 5)
      jTonnage      = Math.max(jTonnage, 10)
      jCost         = jTonnage * 1500000    
      jPower        = tonnage * 0.1 * jRating
      jTLText       = "TL" + jConfig.tl
    }

    const totalTonnage     = mTonnage + jTonnage
    const remainingTonnage = tonnage - totalTonnage
    const totalCost        = mCost + jCost
    const totalPower       = mPower + jPower

    this.maneuverTonnageTarget.textContent = mTonnage + " tons"
    this.maneuverCostTarget.textContent    = "Cr" + mCost.toLocaleString()
    this.maneuverPowerTarget.textContent   = mPower
    this.maneuverTLTarget.textContent      = "TL" + mConfig.tl

    this.jumpTonnageTarget.textContent     = jTonnage + " tons"
    this.jumpCostTarget.textContent        = "Cr" + jCost.toLocaleString()
    this.jumpPowerTarget.textContent       = jPower
    this.jumpTLTarget.textContent          = jTLText

    this.totalTonnageTarget.textContent     = totalTonnage + " tons"
    this.remainingTonnageTarget.textContent = remainingTonnage + " tons"
    this.totalCostTarget.textContent        = "Cr" + totalCost.toLocaleString()
    this.totalPowerTarget.textContent       = totalPower

    this.maneuverTonnageInputTarget.value = mTonnage
    this.maneuverCostInputTarget.value    = mCost
    this.maneuverPowerInputTarget.value   = mPower
    this.jumpTonnageInputTarget.value     = jTonnage
    this.jumpCostInputTarget.value        = jCost
    this.jumpPowerInputTarget.value       = jPower
  }
}