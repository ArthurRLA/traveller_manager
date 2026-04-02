# Traveller Manager

An unofficial fan tool for **Mongoose Traveller 2nd Edition** tabletop RPG.
Built as a portfolio project — a web-based manager for generating star systems
and designing spacecraft following the High Guard ruleset.

> Not affiliated with Mongoose Publishing.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Language    | Ruby 3.3.0                        |
| Framework   | Rails 8.0.2                       |
| Database    | PostgreSQL (JSONB for ship data)  |
| Frontend JS | Hotwire, Turbo, Stimulus          |
| CSS         | Custom (no framework)             |
| Deploy      | Render (planned)                  |

---

## Dependencies

### Ruby Gems (Gemfile)
- `rails 8.0.2` — Core framework
- `pg` — PostgreSQL adapter
- `puma` — Web server
- `importmap-rails` — JavaScript via import maps
- `turbo-rails` — Hotwire Turbo
- `stimulus-rails` — Hotwire Stimulus
- `solid_cache`, `solid_queue`, `solid_cable` — Rails 8 defaults
- `rubocop-rails-omakase` — Linting

---

## Local Setup

### Prerequisites
- WSL2 (Ubuntu) or Linux/macOS
- rbenv + Ruby 3.3.0
- PostgreSQL 14+
- Node.js (LTS) via nvm

### Installation
```bash
# Clone the repository
git clone https://github.com/<ArthurRLA>/traveller_manager.git
cd traveller_manager

# Install Ruby dependencies
bundle install

# Configure database
# Edit config/database.yml with your PostgreSQL credentials
# Default expects:
#   username: traveller_user
#   password: traveller_postgres
#   host: localhost

# Create and migrate database
rails db:create db:migrate

# Start the server
rails server
```

---

## Database

Single table with JSONB for flexibility:
```
ships
├── id              (integer, PK)
├── name            (string)
├── status          (integer, enum: in_progress=0 / completed=1)
├── current_step    (integer, 1–13)
├── build_data      (jsonb)
├── created_at      (datetime)
└── updated_at      (datetime)
```

### build_data JSONB Structure
```json
{
  "hull": {
    "tonnage": 200,
    "configuration": "streamlined",
    "specialised_type": "reinforced",
    "additional_type": "none",
    "additional_type_percent": 0,
    "armour_type": "crystaliron",
    "armour_value": 4,
    "armour_tonnage": 10,
    "stealth_type": "none",
    "stealth_tonnage": 0,
    "heat_shielding": false,
    "radiation_shielding": false,
    "reflec": false,
    "solar_coating": false,
    "cost": 14400000,
    "hull_points": 80
  },
  "drives": {
    "manoeuvre": { "rating": 2, "tonnage": 4,  "cost": 8000000,  "power": 40 },
    "jump":      { "rating": 2, "tonnage": 15, "cost": 22500000, "power": 40 }
  },
  "power_plant": {
    "type": "fusion_tl12",
    "tonnage": 6,
    "cost": 6000000,
    "power_generated": 90
  },
  "fuel": {
    "jump_fuel": 40,
    "power_fuel": 1,
    "total_fuel": 41
  },
  "bridge": {
    "type": "standard",
    "tonnage": 10,
    "cost": 1000000,
    "holographic": false
  },
  "computer": {
    "primary": { "model": "computer_15", "bis": false, "fib": false, "cost": 2000000 },
    "backup":  { "model": "none", "cost": 0 },
    "total_cost": 2000000
  },
  "sensors": {
    "type": "military",
    "tonnage": 2,
    "cost": 4100000,
    "power": 2,
    "dm": 0
  },
  "weapons": {
    "data": [
      {
        "id": 1234567890,
        "mountType": "double_turret",
        "mountName": "Double Turret",
        "weaponType": "pulse_laser",
        "weaponName": "Pulse Laser",
        "tons": 1,
        "hardpoints": 1,
        "power": 5,
        "cost": 1500000,
        "damage": "2D",
        "range": "Long"
      }
    ],
    "total_tonnage": 1,
    "total_cost": 1500000,
    "total_power": 5
  },
  "optional_systems": {
    "data": [
      {
        "id": 1234567891,
        "category": "fuel",
        "systemType": "fuel_processor",
        "name": "Fuel Processor",
        "tons": 2,
        "power": 2,
        "cost": 100000,
        "note": "20 tons refined per day per ton"
      }
    ],
    "total_tonnage": 2,
    "total_cost": 100000,
    "total_power": 2
  },
  "crew": {
    "ship_type": "commercial",
    "captain": 1,
    "pilot": 1,
    "astrogator": 1,
    "engineer": 1,
    "maintenance": 0,
    "gunner": 1,
    "administrator": 0,
    "sensor_operator": 0,
    "steward": 0,
    "medic": 0,
    "officer": 0,
    "total_crew": 5,
    "total_salary": 22000,
    "include_steward": false,
    "include_medic": false,
    "include_officer": false,
    "high_passengers": 0,
    "middle_passengers": 0
  },
  "staterooms": {
    "standard": 4,
    "double_occupancy": 0,
    "high": 0,
    "luxury": 0,
    "low_berths": 0,
    "emergency_low_berths": 0,
    "common_area": 4,
    "total_tonnage": 20,
    "total_cost": 2400000,
    "total_power": 0,
    "total_capacity": 4
  },
  "cargo": {
    "tonnage": 11,
    "available": 11
  },
  "summary": {
    "total_tonnage_used": 112,
    "total_cost": 36940000,
    "monthly_maintenance": 3078
  }
}
```

---

## Project Structure
```
traveller_manager/
├── app/
│   ├── assets/
│   │   └── stylesheets/
│   │       ├── application.css       # Clears default Rails styles
│   │       └── traveller.css         # Full custom design system
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── home_controller.rb        # Hub/landing page
│   │   └── ships_controller.rb       # Full CRUD + wizard steps
│   ├── javascript/
│   │   └── controllers/
│   │       ├── application.js
│   │       ├── bridge_controller.js
│   │       ├── cargo_controller.js
│   │       ├── computer_controller.js
│   │       ├── crew_controller.js
│   │       ├── drives_controller.js
│   │       ├── fuel_tanks_controller.js
│   │       ├── hull_controller.js
│   │       ├── optional_systems_controller.js
│   │       ├── power_plant_controller.js
│   │       ├── sensors_controller.js
│   │       ├── staterooms_controller.js
│   │       └── weapons_controller.js
│   ├── models/
│   │   ├── application_record.rb
│   │   └── ship.rb                   # Ship model with JSONB helpers
│   ├── helpers/
│   │   └── ships_helper.rb           # step_status_class helper
│   └── views/
│       ├── home/
│       │   └── index.html.erb        # Hub/landing page
│       ├── layouts/
│       │   └── application.html.erb  # Navbar + flash messages
│       └── ships/
│           ├── _wizard_nav.html.erb  # Sticky step sidebar
│           ├── index.html.erb        # Ships list
│           ├── new.html.erb          # Name your ship
│           └── steps/
│               ├── step_1.html.erb   # Hull
│               ├── step_2.html.erb   # Drives
│               ├── step_3.html.erb   # Power Plant
│               ├── step_4.html.erb   # Fuel Tanks
│               ├── step_5.html.erb   # Bridge
│               ├── step_6.html.erb   # Computer
│               ├── step_7.html.erb   # Sensors
│               ├── step_8.html.erb   # Weapons
│               ├── step_9.html.erb   # Optional Systems
│               ├── step_10.html.erb  # Crew
│               ├── step_11.html.erb  # Staterooms
│               ├── step_12.html.erb  # Cargo
│               └── step_13.html.erb  # Finalise
├── config/
│   ├── database.yml                  # PostgreSQL config
│   └── routes.rb                     # Routes
└── db/
    └── migrate/
        └── *_create_ships.rb
```

---

## Routes
```
GET  /                              home#index          (Hub)
GET  /ships                         ships#index         (Ship list)
GET  /ships/new                     ships#new           (Name ship)
POST /ships                         ships#create        (Create ship)
GET  /ships/:id                     ships#show          (Redirect to step)
GET  /ships/:id/step/:step_number   ships#step          (Show wizard step)
PATCH /ships/:id/step/:step_number  ships#update_step   (Save wizard step)
DELETE /ships/:id                   ships#destroy       (Delete ship)
```

---

## Ship Builder Wizard — 13 Steps

Each step saves to `build_data` JSONB and advances `current_step`.

| Step | Name             | Stimulus Controller      | Key Calculations                              |
|------|------------------|--------------------------|-----------------------------------------------|
| 1    | Hull             | hull_controller          | Cost, Hull Points, Armour, Stealth tonnage    |
| 2    | Drives           | drives_controller        | M-Drive %, J-Drive %, Power requirements      |
| 3    | Power Plant      | power_plant_controller   | Power generated vs required                   |
| 4    | Fuel Tanks       | fuel_tanks_controller    | Jump fuel (10% × jump rating), PP fuel        |
| 5    | Bridge           | bridge_controller        | Size by tonnage table, cost MCr0.5/100t       |
| 6    | Computer         | computer_controller      | Processing, /bis and /fib options             |
| 7    | Sensors          | sensors_controller       | DM, tonnage, power by type                    |
| 8    | Weapons          | weapons_controller       | Hardpoints (1/100t), damage multiples         |
| 9    | Optional Systems | optional_systems_controller | 11 categories, full Spacecraft Options     |
| 10   | Crew             | crew_controller          | Per tonnage thresholds, optional positions    |
| 11   | Staterooms       | staterooms_controller    | Single/double occupancy, low berths           |
| 12   | Cargo            | cargo_controller         | Remaining tonnage calculation                 |
| 13   | Finalise         | —                        | Total cost, maintenance (cost/12000)          |

---

## Design System

- **Font:** Barlow Condensed (headers) + Barlow (body) via Google Fonts
- **Primary color:** `#E8692A` (Traveller orange)
- **Background:** `#1A1A1A` dark
- **Cards:** `clip-path` angled corners for sci-fi aesthetic
- **Inspired by:** Mongoose Traveller 2nd Edition official ship sheets

---

## Features Roadmap

- [x] Ship Builder (High Guard — 13 steps)
- [ ] Star System Generator
- [ ] NPC Generator
- [ ] Trade Calculator
- [ ] Combat Tracker
- [ ] Campaign Manager
- [ ] User Authentication (Devise)

---

## Source Material

All rules are based on:
- **Traveller Core Rulebook** (Mongoose Publishing, 2nd Edition)
- **High Guard** (Mongoose Publishing, 2022 Update)

This tool is for personal and educational use only.