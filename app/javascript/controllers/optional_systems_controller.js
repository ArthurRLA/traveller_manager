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
    structure: {
      label: "Structure",
      items: {
        armoured_bulkhead:  { name: "Armoured Bulkhead",   costPerTon: 200000,  powerPerTon: 0, fixedCost: 0,        fixedTons: 0,  note: "10% of protected item tonnage. Severity of critical hits -1"  },
        adjustable_hull_12: { name: "Adjustable Hull (TL12)", costPerTon: 0,    powerPerTon: 0, fixedCost: 0,        fixedTons: 0,  note: "5% of ship tonnage. +10% base hull cost. Changes ship outline" },
        adjustable_hull_15: { name: "Adjustable Hull (TL15)", costPerTon: 0,    powerPerTon: 0, fixedCost: 0,        fixedTons: 0,  note: "1% of ship tonnage. +100% base hull cost"                     },
        pressure_hull:      { name: "Pressure Hull",       costPerTon: 0,       powerPerTon: 0, fixedCost: 0,        fixedTons: 0,  note: "25% of vessel tonnage. 10x hull cost. Armour +4"              },
        modular_hull:       { name: "Modular Hull Module",  costPerTon: 25000,  powerPerTon: 0, fixedCost: 0,        fixedTons: 0,  note: "Cr25000 per ton of module"                                    }
      }
    },
    power: {
      label: "Power",
      items: {
        emergency_power:    { name: "Emergency Power System",       costPerTon: 0,      powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "10% of power plant tons/cost. 90% power for 5 rounds on critical hit" },
        batteries_tl10:     { name: "High-Efficiency Batteries (TL10)", costPerTon: 100000, powerPerTon: 0, fixedCost: 0,   fixedTons: 0, note: "40 Power per ton stored"                                              },
        batteries_tl12:     { name: "High-Efficiency Batteries (TL12)", costPerTon: 200000, powerPerTon: 0, fixedCost: 0,   fixedTons: 0, note: "60 Power per ton stored"                                              },
        solar_coating_tl10: { name: "Solar Coating (TL10)",         costPerTon: 300000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "0.1 Power per unit. Max 40% of hull. No tonnage consumed"             },
        solar_panels_tl6:   { name: "Solar Panels (TL6)",           costPerTon: 100000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "0.25 Power per ton. Must be deployed to work"                        },
        solar_panels_tl8:   { name: "Solar Panels (TL8)",           costPerTon: 200000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "0.5 Power per ton. Must be deployed to work"                         },
        solar_panels_tl12:  { name: "Solar Panels (TL12)",          costPerTon: 400000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "2 Power per ton. Must be deployed to work"                           }
      }
    },
    drives: {
      label: "Drives",
      items: {
        high_burn:          { name: "High-Burn Thruster",           costPerTon: 200000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Auxiliary chemical rocket. Temporary speed boost. No G compensation" },
        concealed_drive:    { name: "Concealed Manoeuvre Drive",    costPerTon: 0,      powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "+25% tonnage and cost of m-drive. Halves thrust performance"          },
        solar_sail:         { name: "Solar Sail",                   costPerTon: 200000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "5% of hull tonnage. Effective Thrust 0. No power or fuel needed"      }
      }
    },
    fuel: {
      label: "Fuel",
      items: {
        fuel_scoop:         { name: "Fuel Scoop",                   costPerTon: 0,      powerPerTon: 0, fixedCost: 1000000, fixedTons: 0, note: "MCr1, no tonnage. Allows gas giant refuelling for unstreamlined ships" },
        fuel_processor:     { name: "Fuel Processor",               costPerTon: 50000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0, note: "20 tons refined per day per ton"                                       },
        collapsible_tank:   { name: "Collapsible Fuel Tank",        costPerTon: 500,    powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Cr500/ton. Uses cargo space. Cannot feed jump drive directly"          },
        drop_tank_mount:    { name: "Drop Tank Mount",              costPerTon: 500000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "0.4% of drop tank tonnage on ship. MCr0.5/ton"                         },
        fuel_cargo_container: { name: "Fuel/Cargo Container",       costPerTon: 5000,   powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Cr5000/ton capacity. +0.05 tons per ton of capacity for fittings"      },
        fuel_tank_compartment: { name: "Fuel Tank Compartment",     costPerTon: 4000,   powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Hidden in fuel tanks. DM-4 sensors, DM-6 Investigate"                 },
        metal_hydride:      { name: "Metal Hydride Storage",        costPerTon: 200000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "2x space of normal fuel. Reduces fuel leak severity"                   },
        mountable_tank:     { name: "Mountable Tank",               costPerTon: 1000,   powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Cr1000/ton. Converts cargo to fuel. 4 weeks to install/remove"         },
        ramscoops:          { name: "Ramscoops",                    costPerTon: 250000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1% hull + 5 tons minimum. 5 tons H per week per ton"                   }
      }
    },
    accommodations: {
      label: "Accommodations",
      items: {
        acceleration_bench: { name: "Acceleration Bench (4 seats)", costPerTon: 0,      powerPerTon: 0, fixedCost: 10000,   fixedTons: 1, note: "4 seats per ton. Basic temporary passenger seating"    },
        acceleration_seat:  { name: "Acceleration Seat (1 seat)",   costPerTon: 0,      powerPerTon: 0, fixedCost: 30000,   fixedTons: 1, note: "0.5 tons each. Cr30000 each"                            },
        barracks:           { name: "Barracks",                     costPerTon: 50000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1 ton per passenger. Cr500 life support/ton/month"       },
        brig:               { name: "Brig",                         costPerTon: 0,      powerPerTon: 0, fixedCost: 250000,  fixedTons: 4, note: "Holds 6 prisoners. MCr0.25. Cr1000 life support/month"   },
        cabin_space:        { name: "Cabin Space",                  costPerTon: 50000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1.5 tons per passenger. Short-haul only"                 },
        multi_environment:  { name: "Multi-Environment Space",      costPerTon: 500000, powerPerTon: 1, fixedCost: 0,       fixedTons: 0, note: "+5% tonnage for equipment. For alien environments"       }
      }
    },
    bridge_options: {
      label: "Bridge Options",
      items: {
        detachable_bridge:  { name: "Detachable Bridge",            costPerTon: 0,      powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "+50% bridge cost, +20% tonnage. Becomes lifeboat in emergency" },
        holographic_controls: { name: "Holographic Controls",      costPerTon: 0,      powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "+25% bridge cost. DM+2 to initiative. TL9+"                    },
        sensor_station:     { name: "Sensor Station",               costPerTon: 0,      powerPerTon: 0, fixedCost: 500000,  fixedTons: 1, note: "1 ton, MCr0.5. Extra sensor action per round. Max on ships ≤7500 tons" }
      }
    },
    cargo_options: {
      label: "Cargo",
      items: {
        cargo_crane:        { name: "Cargo Crane",                  costPerTon: 1000000, powerPerTon: 0, fixedCost: 0,      fixedTons: 0, note: "2.5 + 0.5 per 150 tons of cargo. MCr1/ton. Lifts up to 65 tons" },
        cargo_net:          { name: "Cargo Net",                    costPerTon: 0,       powerPerTon: 0, fixedCost: 1000000, fixedTons: 5, note: "5 tons, MCr1. Retrieves floating cargo. Cannot jump when deployed" },
        cargo_scoop:        { name: "Cargo Scoop",                  costPerTon: 0,       powerPerTon: 0, fixedCost: 500000,  fixedTons: 2, note: "2 tons, MCr0.5. Picks up 1 ton/round"                             },
        external_cargo:     { name: "External Cargo Mount",         costPerTon: 1000,    powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Cr1000/ton of cargo. Ship becomes unstreamlined"                  },
        jump_net_inter:     { name: "Interplanetary Jump Net (TL8)", costPerTon: 100000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1 ton per 100 tons of cargo. Cannot jump when deployed"            },
        jump_net_inter_st:  { name: "Interstellar Jump Net (TL10)", costPerTon: 300000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1 ton per 100 tons of cargo. Extends jump field"                   },
        loading_belt_tl7:   { name: "Loading Belt (TL7)",           costPerTon: 0,       powerPerTon: 1, fixedCost: 3000,    fixedTons: 1, note: "1 ton, Cr3000. Work of 10 crewmen"                                 },
        loading_belt_tl12:  { name: "Loading Belt (TL12)",          costPerTon: 0,       powerPerTon: 1, fixedCost: 10000,   fixedTons: 1, note: "1 ton, Cr10000. Work of 25 crewmen"                                }
      }
    },
    drones: {
      label: "Drones",
      items: {
        mining_drones:      { name: "Mining Drones (TL12)",         costPerTon: 0,      powerPerTon: 0, fixedCost: 1000000, fixedTons: 10, note: "5 drones per 10 tons. Processes 5D tons asteroid/day"    },
        probe_drones:       { name: "Probe Drones (TL9)",           costPerTon: 0,      powerPerTon: 0, fixedCost: 500000,  fixedTons: 1,  note: "5 drones per ton. MCr0.5. Surveys planets"               },
        probe_drones_adv:   { name: "Advanced Probe Drones (TL12)", costPerTon: 0,      powerPerTon: 0, fixedCost: 800000,  fixedTons: 1,  note: "5 drones per ton. MCr0.8. Advanced sensors"              },
        repair_drones:      { name: "Repair Drones (TL10)",         costPerTon: 200000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "1% of ship tonnage min. MCr0.2/ton. Extra repair action"  }
      }
    },
    sensors_upgrades: {
      label: "Sensor Upgrades",
      items: {
        countermeasures:    { name: "Countermeasures Suite (TL13)",      costPerTon: 0, powerPerTon: 1, fixedCost: 4000000,  fixedTons: 2,  note: "DM+4 to all jamming and EW"                               },
        mil_countermeasures:{ name: "Military Countermeasures (TL15)",   costPerTon: 0, powerPerTon: 2, fixedCost: 28000000, fixedTons: 15, note: "DM+6 to all jamming and EW"                               },
        deep_pen_scanners:  { name: "Deep Penetration Scanners (TL13)",  costPerTon: 1000000, powerPerTon: 1, fixedCost: 0, fixedTons: 0,  note: "MCr1/ton. 20 tons scanned per hour per ton. Adjacent range" },
        extension_net:      { name: "Extension Net (TL10)",              costPerTon: 1000000, powerPerTon: 0, fixedCost: 0, fixedTons: 0,  note: "1% ship tonnage. Extends sensor detail range by 1 step"    },
        life_scanner:       { name: "Life Scanner (TL12)",               costPerTon: 0, powerPerTon: 1, fixedCost: 2000000,  fixedTons: 1,  note: "MCr2. Detects and categorises life forms from orbit"       },
        life_scanner_adv:   { name: "Life Scanner Analysis Suite (TL14)",costPerTon: 0, powerPerTon: 1, fixedCost: 4000000,  fixedTons: 1,  note: "MCr4. Full biological analysis of detected life"           },
        mail_array_tl10:    { name: "Mail Distribution Array (TL10)",    costPerTon: 0, powerPerTon: 0, fixedCost: 20000000, fixedTons: 10, note: "10 tons, MCr20. X-boat network data handling"              },
        mail_array_tl13:    { name: "Mail Distribution Array (TL13)",    costPerTon: 0, powerPerTon: 0, fixedCost: 10000000, fixedTons: 20, note: "20 tons, MCr10. Advanced x-boat network"                  },
        mineral_detection:  { name: "Mineral Detection Suite (TL12)",    costPerTon: 0, powerPerTon: 0, fixedCost: 5000000,  fixedTons: 1,  note: "MCr5. Upgrades densitometer to detect mineral types"       },
        shallow_pen:        { name: "Shallow Penetration Suite (TL10)",  costPerTon: 0, powerPerTon: 1, fixedCost: 5000000,  fixedTons: 10, note: "10 tons, MCr5. Thermal/EM hull scanning at Very Long range" },
        signal_improved:    { name: "Improved Signal Processing (TL11)", costPerTon: 0, powerPerTon: 1, fixedCost: 4000000,  fixedTons: 1,  note: "DM+2 to sensors. Doubles enemy jamming DMs"                },
        signal_enhanced:    { name: "Enhanced Signal Processing (TL13)", costPerTon: 0, powerPerTon: 2, fixedCost: 8000000,  fixedTons: 2,  note: "DM+4 to sensors. No jamming vulnerability"                 }
      }
    },
    external_systems: {
      label: "External Systems",
      items: {
        aerofins:           { name: "Aerofins",                     costPerTon: 100000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "5% ship tonnage. DM+2 to Pilot in atmosphere"              },
        breaching_tube:     { name: "Breaching Tube",               costPerTon: 0,       powerPerTon: 0, fixedCost: 3000000, fixedTons: 3, note: "3 tons, MCr3. DM+1 boarding actions"                       },
        docking_clamp_1:    { name: "Docking Clamp Type I (1-30t)", costPerTon: 0,       powerPerTon: 0, fixedCost: 500000,  fixedTons: 1, note: "Carries 1-30 ton craft externally"                          },
        docking_clamp_2:    { name: "Docking Clamp Type II (31-99t)",costPerTon: 0,      powerPerTon: 0, fixedCost: 1000000, fixedTons: 5, note: "Carries 31-99 ton craft externally"                         },
        docking_clamp_3:    { name: "Docking Clamp Type III (100-300t)", costPerTon: 0,  powerPerTon: 0, fixedCost: 2000000, fixedTons: 10, note: "Carries 100-300 ton craft externally"                      },
        docking_clamp_4:    { name: "Docking Clamp Type IV (301-2000t)", costPerTon: 0,  powerPerTon: 0, fixedCost: 4000000, fixedTons: 20, note: "Carries 301-2000 ton craft externally"                     },
        docking_clamp_5:    { name: "Docking Clamp Type V (2001t+)", costPerTon: 0,      powerPerTon: 0, fixedCost: 8000000, fixedTons: 50, note: "Carries 2001+ ton craft externally"                        },
        forced_linkage_b:   { name: "Forced Linkage Apparatus (TL7)", costPerTon: 0,     powerPerTon: 0, fixedCost: 50000,   fixedTons: 2, note: "DM-2 Pilot check. Boarding/towing device"                   },
        forced_linkage_i:   { name: "Forced Linkage Apparatus (TL9)", costPerTon: 0,     powerPerTon: 0, fixedCost: 75000,   fixedTons: 2, note: "DM-1 Pilot check"                                           },
        forced_linkage_e:   { name: "Forced Linkage Apparatus (TL12)", costPerTon: 0,    powerPerTon: 0, fixedCost: 100000,  fixedTons: 2, note: "DM+0 Pilot check"                                           },
        forced_linkage_a:   { name: "Forced Linkage Apparatus (TL15)", costPerTon: 0,    powerPerTon: 0, fixedCost: 500000,  fixedTons: 2, note: "DM+2 Pilot check"                                           },
        grappling_arm:      { name: "Grappling Arm",                costPerTon: 0,       powerPerTon: 0, fixedCost: 1000000, fixedTons: 2, note: "2 tons, MCr1. Manipulates up to 2 tons at 250m reach"        },
        heavy_grappling:    { name: "Heavy Grappling Arm",          costPerTon: 0,       powerPerTon: 0, fixedCost: 3000000, fixedTons: 6, note: "6 tons, MCr3. Manipulates up to 10 tons"                     },
        holographic_hull:   { name: "Holographic Hull (TL10)",      costPerTon: 100000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "Cr100000/ton hull. Changes ship appearance. 1 power/2 tons"  },
        tow_cable:          { name: "Tow Cable",                    costPerTon: 5000,    powerPerTon: 0, fixedCost: 0,       fixedTons: 0, note: "1% ship tonnage. Cr5000/ton. Cannot jump while towing"       }
      }
    },
    internal_systems: {
      label: "Internal Systems",
      items: {
        additional_airlock: { name: "Additional Airlock",           costPerTon: 100000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 2,  note: "Min 2 tons, MCr0.1/ton"                                     },
        armoury:            { name: "Armoury",                      costPerTon: 250000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 1,  note: "1 ton per 25 crew/5 marines. MCr0.25/ton"                    },
        biosphere:          { name: "Biosphere",                    costPerTon: 200000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0,  note: "MCr0.2/ton. Eliminates life support for 2 passengers per ton" },
        booby_trap_basic:   { name: "Booby-Trapped Airlock (TL6)",  costPerTon: 0,       powerPerTon: 0, fixedCost: 100000,  fixedTons: 0,  note: "MCr0.1. 3D damage/round to intruders"                        },
        booby_trap_imp:     { name: "Booby-Trapped Airlock (TL8)",  costPerTon: 0,       powerPerTon: 0, fixedCost: 300000,  fixedTons: 0,  note: "MCr0.3. 5D damage/round"                                     },
        booby_trap_enh:     { name: "Booby-Trapped Airlock (TL10)", costPerTon: 0,       powerPerTon: 0, fixedCost: 500000,  fixedTons: 0,  note: "MCr0.5. 6D damage/round"                                     },
        booby_trap_adv:     { name: "Booby-Trapped Airlock (TL12)", costPerTon: 0,       powerPerTon: 0, fixedCost: 1000000, fixedTons: 0,  note: "MCr1. 8D damage/round"                                       },
        briefing_room:      { name: "Briefing Room",                costPerTon: 0,       powerPerTon: 0, fixedCost: 500000,  fixedTons: 4,  note: "4 tons, MCr0.5. DM+1 to Tactics (military)"                  },
        concealed_comp:     { name: "Concealed Compartment",        costPerTon: 20000,   powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "Up to 5% hull. DM-2 sensors, DM-4 Investigate"               },
        construction_deck:  { name: "Construction Deck",            costPerTon: 500000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0,  note: "MCr0.5/ton. 1 Power/ton. Builds ships up to half its tonnage" },
        docking_space:      { name: "Docking Space",                costPerTon: 250000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "Craft tonnage +10%. MCr0.25/ton"                              },
        full_hangar:        { name: "Full Hangar",                  costPerTon: 200000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "2x craft tonnage. MCr0.2/ton. Allows onboard repairs"         },
        grav_screen:        { name: "Grav Screen (TL12)",           costPerTon: 1000000, powerPerTon: 2, fixedCost: 0,       fixedTons: 0,  note: "1 ton per 200 hull tons. Blocks densitometers"                },
        hardened_system:    { name: "Hardened System",              costPerTon: 0,       powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "+50% cost of system. Immune to Ion weapons"                   },
        laboratory:         { name: "Laboratory",                   costPerTon: 1000000, powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "MCr1/4 tons. 1 scientist per 4 tons"                          },
        launch_tube:        { name: "Launch Tube (TL9)",            costPerTon: 500000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0,  note: "10x largest craft. MCr0.5/ton. Launches 10 craft/round"        },
        library:            { name: "Library (TL8)",                costPerTon: 0,       powerPerTon: 0, fixedCost: 4000000, fixedTons: 4,  note: "4 tons, MCr4. DM+1 to EDU checks in jump"                     },
        medical_bay:        { name: "Medical Bay",                  costPerTon: 0,       powerPerTon: 1, fixedCost: 2000000, fixedTons: 4,  note: "4 tons, MCr2. DM+1 Medic. 3 patients per 4 tons"              },
        recovery_deck:      { name: "Recovery Deck (TL9)",          costPerTon: 500000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0,  note: "10x largest craft. MCr0.5/ton. Recovers 1 craft/round"         },
        stable:             { name: "Stable",                       costPerTon: 2500,    powerPerTon: 0, fixedCost: 0,       fixedTons: 10, note: "Min 10 tons. Cr2500/ton. 20 human-sized creatures per 10 tons" },
        studio:             { name: "Studio",                       costPerTon: 100000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 4,  note: "4 tons, MCr0.1/ton. 1 Profession skill user per 4 tons"       },
        training_facilities:{ name: "Training Facilities",          costPerTon: 200000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "2 tons per trainee. MCr0.2/ton"                               },
        unrep_system:       { name: "UNREP System",                 costPerTon: 500000,  powerPerTon: 1, fixedCost: 0,       fixedTons: 0,  note: "MCr0.5/ton. 20 tons fuel/cargo/ordnance transfer per hour"    },
        vault:              { name: "Vault",                        costPerTon: 500000,  powerPerTon: 0, fixedCost: 0,       fixedTons: 0,  note: "4-40 tons. MCr0.5/ton. 1 Armour/ton (max 10). Survives destruction" },
        workshop:           { name: "Workshop",                     costPerTon: 0,       powerPerTon: 0, fixedCost: 900000,  fixedTons: 6,  note: "6 tons, MCr0.9. DM+2 Mechanic. 2 users simultaneously"         }
      }
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
    const systems  = this.constructor.SYSTEMS[category]?.items || {}

    this.systemTypeTarget.innerHTML = Object.entries(systems)
      .map(([key, s]) => `<option value="${key}">${s.name}</option>`)
      .join("")
  }

  addSystem() {
    const category   = this.categoryTarget.value
    const systemType = this.systemTypeTarget.value
    const tonnage    = parseInt(this.systemTonnageTarget.value) || 1
    const system     = this.constructor.SYSTEMS[category]?.items[systemType]

    if (!system) return

    const finalTons  = system.fixedTons  > 0 ? system.fixedTons  : tonnage
    const finalCost  = system.fixedCost  > 0 ? system.fixedCost  : finalTons * system.costPerTon
    const finalPower = system.fixedTons  > 0
      ? system.fixedTons  * system.powerPerTon
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
        '<p class="empty-state">No optional systems installed yet.</p>'
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
                <td><small>${s.note}</small></td>
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