import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "category", "systemType", "systemTonnage",
    "systemsList",
    "totalTonnage", "totalPower", "totalCost",
    "systemsDataInput", "totalTonnageInput",
    "totalCostInput", "totalPowerInput"
  ]

  static SYSTEMS = {
    fuel: {
      fuel_scoop:       { name: "Fuel Scoop",          costPerTon: 0,       powerPerTon: 0, fixedCost: 1000000, fixedTons: 0,   note: "Costs MCr1, no tonnage" },
      fuel_processor:   { name: "Fuel Processor",      costPerTon: 50000,   powerPerTon: 1, fixedCost: 0,       fixedTons: 0,   note: "20 tons refined per day per ton" },
      collapsible_tank: { name: "Collapsible Fuel Tank",costPerTon: 500,     powerPerTon: 0, fixedCost: 0,       fixedTons: 0,   note: "Expands when filled" },
      drop_tank_mount:  { name: "Drop Tank Mount",      costPerTon: 500000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0,   note: "0.4% of drop tank tonnage" }
    },
    craft: {
      docking_space:    { name: "Docking Space",        costPerTon: 250000,  powerPerTon: 0, fixedCost: 0, fixedTons: 0, note: "+10% of craft tonnage" },
      full_hangar:      { name: "Full Hangar",           costPerTon: 200000,  powerPerTon: 0, fixedCost: 0, fixedTons: 0, note: "2x craft tonnage" },
      launch_tube:      { name: "Launch Tube",           costPerTon: 500000,  powerPerTon: 1, fixedCost: 0, fixedTons: 0, note: "10x largest craft tonnage" },
      recovery_deck:    { name: "Recovery Deck",         costPerTon: 500000,  powerPerTon: 1, fixedCost: 0, fixedTons: 0, note: "10x largest craft tonnage" }
    },
    sensors: {
      countermeasures:  { name: "Countermeasures Suite",    costPerTon: 0, powerPerTon: 1, fixedCost: 4000000,  fixedTons: 2,  note: "DM+4 to jamming" },
      mil_countermeasures: { name: "Military Countermeasures", costPerTon: 0, powerPerTon: 2, fixedCost: 28000000, fixedTons: 15, note: "DM+6 to jamming" },
      life_scanner:     { name: "Life Scanner",             costPerTon: 0, powerPerTon: 1, fixedCost: 2000000,  fixedTons: 1,  note: "Detects life forms" },
      shallow_pen:      { name: "Shallow Penetration Suite",costPerTon: 0, powerPerTon: 1, fixedCost: 5000000,  fixedTons: 10, note: "Hull penetration scanning" }
    },
    misc: {
      armoury:          { name: "Armoury",           costPerTon: 250000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1 ton per 25 crew/5 marines"  },
      briefing_room:    { name: "Briefing Room",     costPerTon: 0,       powerPerTon: 0, fixedCost: 500000,  fixedTons: 4, note: "DM+1 to Tactics (military)"  },
      laboratory:       { name: "Laboratory",        costPerTon: 1000000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1 scientist per 4 tons"       },
      library:          { name: "Library",           costPerTon: 0,       powerPerTon: 0, fixedCost: 4000000, fixedTons: 4, note: "DM+1 to EDU checks in jump"   },
      medical_bay:      { name: "Medical Bay",       costPerTon: 0,       powerPerTon: 1, fixedCost: 2000000, fixedTons: 4, note: "DM+1 to Medic checks"         },
      repair_drones:    { name: "Repair Drones",     costPerTon: 200000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1% of ship tonnage minimum"   },
      workshop:         { name: "Workshop",          costPerTon: 0,       powerPerTon: 0, fixedCost: 900000,  fixedTons: 6, note: "DM+2 to Mechanic checks"     }
    }
  }

  connect() {
    this.systems = []
    this.loadShipData()
    this.updateSystemOptions()
    this.updateDisplay()
  }

  loadShipData() {
    const infoBox       = document.querySelector(".info-box")
    this.hullTonnage    = parseInt(infoBox?.dataset.hullTonnage)    || 0
    this.powerAvailable = parseInt(infoBox?.dataset.powerAvailable) || 0
  }

  updateSystemOptions() {
    const category = this.categoryTarget.value
    const systems  = this.constructor.SYSTEMS[category] || {}

    this.systemTypeTarget.innerHTML = Object.entries(systems)
      .map(([key, s]) => `<option value="${key}">${s.name} - ${s.note}</option>`)
      .join("")
  }

  addSystem() {
    const category   = this.categoryTarget.value
    const systemType = this.systemTypeTarget.value
    const tonnage    = parseInt(this.systemTonnageTarget.value) || 1
    const system     = this.constructor.SYSTEMS[category][systemType]

    if (!system) return

    const finalTons = system.fixedTons > 0 ? system.fixedTons : tonnage
    const finalCost = system.fixedCost > 0
      ? system.fixedCost
      : finalTons * system.costPerTon
    const finalPower = system.fixedTons > 0
      ? system.fixedTons * system.powerPerTon
      : finalTons * system.powerPerTon

    this.systems.push({
      id:         Date.now(),
      category:   category,
      systemType: systemType,
      name:       system.name,
      tons:       finalTons,
      power:      finalPower,
      cost:       finalCost,
      note:       system.note
    })

    this.updateDisplay()
  }

  removeSystem(id) {
    this.systems = this.systems.filter(s => s.id !== id)
    this.updateDisplay()
  }

  removeSystemById(event) {
    const id = parseInt(event.currentTarget.dataset.systemId)
    this.removeSystem(id)
  }

  updateDisplay() {
    const totalTonnage = this.systems.reduce((sum, s) => sum + s.tons,  0)
    const totalPower   = this.systems.reduce((sum, s) => sum + s.power, 0)
    const totalCost    = this.systems.reduce((sum, s) => sum + s.cost,  0)

    if (this.systems.length === 0) {
      this.systemsListTarget.innerHTML =
        '<p class="empty-state">No optional systems installed at the moment</p>'
    } else {
      this.systemsListTarget.innerHTML = `
        <table class="weapons-table">
          <thead>
            <tr>
              <th>System</th>
              <th>Note</th>
              <th>Tons</th>
              <th>Power</th>
              <th>Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${this.systems.map(s => `
              <tr>
                <td>${s.name}</td>
                <td>${s.note}</td>
                <td>${s.tons}</td>
                <td>${s.power}</td>
                <td>Cr${s.cost.toLocaleString()}</td>
                <td>
                  <button type="button" class="btn btn-danger btn-sm"
                    data-action="click->optional-systems#removeSystemById"
                    data-system-id="${s.id}">
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

    this.systemsDataInputTarget.value  = JSON.stringify(this.systems)
    this.totalTonnageInputTarget.value = totalTonnage
    this.totalCostInputTarget.value    = totalCost
    this.totalPowerInputTarget.value   = totalPower
  }
}