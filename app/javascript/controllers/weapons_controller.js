import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "newMountType", "newWeaponType",
    "hardpoints", "usedHardpoints",
    "weaponsList",
    "totalTonnage", "totalPower", "totalCost",
    "weaponsDataInput", "totalTonnageInput",
    "totalCostInput", "totalPowerInput"
  ]

  static MOUNTS = {
    fixed_mount:   { name: "Fixed Mount",    tons: 0,   hardpoints: 1, cost: 100000,   power: 0  },
    single_turret: { name: "Single Turret",  tons: 1,   hardpoints: 1, cost: 200000,   power: 1  },
    double_turret: { name: "Double Turret",  tons: 1,   hardpoints: 1, cost: 500000,   power: 1  },
    triple_turret: { name: "Triple Turret",  tons: 1,   hardpoints: 1, cost: 1000000,  power: 1  },
    pop_up:        { name: "Pop-Up",         tons: 1,   hardpoints: 1, cost: 1000000,  power: 0  },
    barbette:      { name: "Barbette",       tons: 5,   hardpoints: 1, cost: 0,        power: 0  },
    small_bay:     { name: "Small Bay",      tons: 50,  hardpoints: 1, cost: 0,        power: 0  },
    medium_bay:    { name: "Medium Bay",     tons: 100, hardpoints: 1, cost: 0,        power: 0  },
    large_bay:     { name: "Large Bay",      tons: 500, hardpoints: 5, cost: 0,        power: 0  }
  }

  static WEAPONS = {
    turret: {
      beam_laser:    { name: "Beam Laser",    cost: 500000,  power: 4,  damage: "1D",  range: "Medium"    },
      fusion_gun:    { name: "Fusion Gun",    cost: 2000000, power: 12, damage: "4D",  range: "Medium"    },
      missile_rack:  { name: "Missile Rack",  cost: 750000,  power: 0,  damage: "4D",  range: "Special"   },
      particle_beam: { name: "Particle Beam", cost: 4000000, power: 8,  damage: "3D",  range: "Very Long" },
      plasma_gun:    { name: "Plasma Gun",    cost: 2500000, power: 6,  damage: "3D",  range: "Medium"    },
      pulse_laser:   { name: "Pulse Laser",   cost: 1000000, power: 4,  damage: "2D",  range: "Long"      },
      railgun:       { name: "Railgun",       cost: 1000000, power: 2,  damage: "2D",  range: "Short"     },
      sandcaster:    { name: "Sandcaster",    cost: 250000,  power: 0,  damage: "Spc", range: "Special"   }
    },
    barbette: {
      beam_laser_b:    { name: "Beam Laser Barbette",   cost: 3000000, power: 12, damage: "2D",  range: "Medium"    },
      fusion_b:        { name: "Fusion Barbette",       cost: 4000000, power: 20, damage: "5D",  range: "Medium"    },
      ion_cannon:      { name: "Ion Cannon",            cost: 6000000, power: 10, damage: "Spc", range: "Medium"    },
      missile_b:       { name: "Missile Barbette",      cost: 4000000, power: 0,  damage: "4D",  range: "Special"   },
      particle_b:      { name: "Particle Barbette",     cost: 8000000, power: 15, damage: "4D",  range: "Very Long" },
      plasma_b:        { name: "Plasma Barbette",       cost: 5000000, power: 12, damage: "4D",  range: "Medium"    },
      pulse_laser_b:   { name: "Pulse Laser Barbette",  cost: 6000000, power: 12, damage: "3D",  range: "Long"      },
      railgun_b:       { name: "Railgun Barbette",      cost: 2000000, power: 5,  damage: "3D",  range: "Medium"    },
      torpedo:         { name: "Torpedo",               cost: 3000000, power: 2,  damage: "6D",  range: "Special"   }
    },
    small_bay: {
      fusion_sb:       { name: "Fusion Gun Bay",        cost: 8000000,  power: 50,  damage: "6D",  range: "Medium"    },
      meson_sb:        { name: "Meson Gun Bay",         cost: 50000000, power: 20,  damage: "5D",  range: "Long"      },
      missile_sb:      { name: "Missile Bay",           cost: 12000000, power: 5,   damage: "4D",  range: "Special"   },
      particle_sb:     { name: "Particle Beam Bay",     cost: 20000000, power: 30,  damage: "6D",  range: "Very Long" },
      torpedo_sb:      { name: "Torpedo Bay",           cost: 3000000,  power: 2,   damage: "6D",  range: "Special"   }
    },
    medium_bay: {
      fusion_mb:       { name: "Fusion Gun Bay",        cost: 14000000,  power: 80,  damage: "7D",  range: "Medium"    },
      meson_mb:        { name: "Meson Gun Bay",         cost: 60000000,  power: 30,  damage: "6D",  range: "Long"      },
      missile_mb:      { name: "Missile Bay",           cost: 20000000,  power: 10,  damage: "4D",  range: "Special"   },
      particle_mb:     { name: "Particle Beam Bay",     cost: 40000000,  power: 50,  damage: "8D",  range: "Very Long" },
      torpedo_mb:      { name: "Torpedo Bay",           cost: 6000000,   power: 5,   damage: "6D",  range: "Special"   }
    },
    large_bay: {
      fusion_lb:       { name: "Fusion Gun Bay",        cost: 25000000,  power: 100, damage: "10D", range: "Long"      },
      meson_lb:        { name: "Meson Gun Bay",         cost: 250000000, power: 120, damage: "6D",  range: "Long"      },
      missile_lb:      { name: "Missile Bay",           cost: 25000000,  power: 20,  damage: "4D",  range: "Special"   },
      particle_lb:     { name: "Particle Beam Bay",     cost: 60000000,  power: 80,  damage: "10D", range: "Distant"   },
      torpedo_lb:      { name: "Torpedo Bay",           cost: 10000000,  power: 10,  damage: "6D",  range: "Special"   }
    }
  }

  connect() {
    this.weapons = []
    this.loadShipData()
    this.updateWeaponOptions()
    this.updateDisplay()
  }

  loadShipData() {
    const infoBox       = document.querySelector(".info-box")
    this.hullTonnage    = parseInt(infoBox?.dataset.hullTonnage)    || 0
    this.powerAvailable = parseInt(infoBox?.dataset.powerAvailable) || 0
    this.maxHardpoints  = Math.floor(this.hullTonnage / 100)
  }

  getWeaponCategory(mountType) {
    if (["fixed_mount", "single_turret", "double_turret",
         "triple_turret", "pop_up"].includes(mountType)) return "turret"
    if (mountType === "barbette")   return "barbette"
    if (mountType === "small_bay")  return "small_bay"
    if (mountType === "medium_bay") return "medium_bay"
    if (mountType === "large_bay")  return "large_bay"
    return "turret"
  }

  updateWeaponOptions() {
    const mountType = this.newMountTypeTarget.value
    const category  = this.getWeaponCategory(mountType)
    const weapons   = this.constructor.WEAPONS[category] || {}

    this.newWeaponTypeTarget.innerHTML = Object.entries(weapons)
      .map(([key, w]) => `<option value="${key}">${w.name} - ${w.damage} - ${w.range}</option>`)
      .join("")
  }

  addWeapon() {
    const mountType  = this.newMountTypeTarget.value
    const weaponType = this.newWeaponTypeTarget.value
    const category   = this.getWeaponCategory(mountType)
    const mount      = this.constructor.MOUNTS[mountType]
    const weapon     = this.constructor.WEAPONS[category][weaponType]

    if (!mount || !weapon) return

    this.weapons.push({
      id:         Date.now(),
      mountType:  mountType,
      mountName:  mount.name,
      weaponType: weaponType,
      weaponName: weapon.name,
      tons:       mount.tons,
      hardpoints: mount.hardpoints,
      power:      mount.power + weapon.power,
      cost:       mount.cost + weapon.cost,
      damage:     weapon.damage,
      range:      weapon.range
    })

    this.updateDisplay()
  }

  removeWeapon(id) {
    this.weapons = this.weapons.filter(w => w.id !== id)
    this.updateDisplay()
  }

  updateDisplay() {
    const usedHardpoints = this.weapons.reduce((sum, w) => sum + w.hardpoints, 0)
    const totalTonnage   = this.weapons.reduce((sum, w) => sum + w.tons,       0)
    const totalPower     = this.weapons.reduce((sum, w) => sum + w.power,      0)
    const totalCost      = this.weapons.reduce((sum, w) => sum + w.cost,       0)

    this.hardpointsTarget.textContent     = this.maxHardpoints
    this.usedHardpointsTarget.textContent = usedHardpoints

    if (this.weapons.length === 0) {
      this.weaponsListTarget.innerHTML =
        '<p class="empty-state">No weapons installed yet.</p>'
    } else {
      this.weaponsListTarget.innerHTML = `
        <table class="weapons-table">
          <thead>
            <tr>
              <th>Mount</th>
              <th>Weapon</th>
              <th>Damage</th>
              <th>Range</th>
              <th>Tons</th>
              <th>Power</th>
              <th>Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${this.weapons.map(w => `
              <tr>
                <td>${w.mountName}</td>
                <td>${w.weaponName}</td>
                <td>${w.damage}</td>
                <td>${w.range}</td>
                <td>${w.tons}</td>
                <td>${w.power}</td>
                <td>Cr${w.cost.toLocaleString()}</td>
                <td>
                  <button type="button" class="btn btn-danger btn-sm"
                    data-action="click->weapons#removeWeaponById"
                    data-weapon-id="${w.id}">
                    Remove
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
    }

    this.totalTonnageTarget.textContent = totalTonnage + " tons"
    this.totalPowerTarget.textContent   = totalPower
    this.totalCostTarget.textContent    = "Cr" + totalCost.toLocaleString()

    this.weaponsDataInputTarget.value   = JSON.stringify(this.weapons)
    this.totalTonnageInputTarget.value  = totalTonnage
    this.totalCostInputTarget.value     = totalCost
    this.totalPowerInputTarget.value    = totalPower
  }

  removeWeaponById(event) {
    const id = parseInt(event.currentTarget.dataset.weaponId)
    this.removeWeapon(id)
  }
}