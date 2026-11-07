# Online Donation Management System 🤝❤️

> **FSD Mini Project**: Full Stack Development using **HTML5, CSS3, JavaScript (ES6+), Express.js (Node.js), and MySQL**.  
> **Topic**: Online Donation Management System — Manage Charitable Donations and Fundraising Campaigns.

---

## 📌 Project Overview & Description

**Online Donation Management System** is a full-stack web application developed for non-profit organizations, donors, and system administrators to facilitate transparent charitable fundraising and digital contribution management.

- **🏛️ Organizations**: Can launch verified fundraising campaigns across critical sectors (Healthcare, Child Education, Hunger Alleviation, Clean Water, Disaster Relief, Environment) with target amounts and timelines.
- **💳 Donors**: Can browse causes, contribute funds via instant simulated payment gateways, search their complete donation ledger, and download/print verified Section 80G Tax Donation Receipts.
- **📊 Admins**: Can monitor executive fundraising progress in real time, compare capital raised against target goals, evaluate category distributions, and audit donor activity.

---

## 🌟 Key Highlights & Architectural Features

- **Inspired by Reference Architecture**: Clean multi-page layout (`index.html`, `list.html`, `listOne.html`, `insert.html`, `update.html`, `delete.html`, `history.html`, `admin.html`) with cohesive dark glassmorphic design.
- **Full CRUD Operations**:
  - **CREATE**: Organizations launch campaigns (`POST /campaigns`); Donors contribute funds (`POST /donations`).
  - **READ ALL**: Explore directory with filtering by category & status, and Table vs. Grid Cards view toggle (`GET /campaigns`, `GET /donations`).
  - **READ ONE**: Look up individual campaigns with financial metrics and donor contribution history (`GET /campaigns/:id`).
  - **UPDATE**: Modify campaign targets, timelines, status, and descriptions (`PUT /campaigns/:id`).
  - **DELETE**: Safe two-step pre-deletion impact inspection before removing records (`DELETE /campaigns/:id`).
- **Resilient Dual-Mode Database Engine**:
  - Automatically connects to **MySQL** using `.env` credentials.
  - If MySQL is offline or not installed on the test machine, it automatically switches to an in-memory resilient data store pre-populated with real-world sample data. **Zero crash guarantee during college evaluations!**
- **Official Tax-Exempt Donation Receipt**: Printable receipt modal with unique transaction verification hashes (`@media print` ready).
- **Responsive & Modern UI**: Built with CSS variables, custom progress bars, live status badges, pulsing animations, and toast notifications.

---

## 📁 Project Directory Structure

```
donation-management-main/
│
├── server.js               # Main Express.js backend server with REST API routes
├── app.js                  # Cross-compatible server runner (require('./server.js'))
├── database.sql            # MySQL database schema (users, campaigns, donations) + seed data
├── package.json            # Node.js project manifest & dependencies
├── .env                    # Environment configuration (Port, DB credentials)
├── .env.example            # Sample configuration template
├── README.md               # Complete project documentation
│
└── public/                 # Client-side frontend assets
    ├── index.html          # Dashboard (Hero, KPIs, CRUD Modules Grid, Featured Causes)
    ├── list.html           # Campaigns Directory (Table & Grid Views, Search, Filter)
    ├── listOne.html        # Single Campaign & Donor History Lookup
    ├── insert.html         # Dual Creator: Org Launch Campaign & Donor Make Donation
    ├── update.html         # Update Campaign Goal, Dates & Status
    ├── delete.html         # Delete Campaign with Two-Step Pre-Audit Verification
    ├── history.html        # Donor Contribution Ledger & Printable Tax Receipts
    ├── admin.html          # Executive Fundraising Progress Monitor Dashboard
    ├── style.css           # 1,200+ line glassmorphic dark design system
    ├── app.js              # Global client utilities & API wrapper
    └── images/             # Visual banners, hero assets, and facility photography
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v16+ or v18+ recommended)
- **MySQL Server** (Optional: through XAMPP, WAMP, MySQL Workbench, or CLI)

### 2. Install Dependencies
Open a terminal in the project directory:
```bash
npm install
```

### 3. Configure Database (MySQL)
1. Start your local MySQL service (e.g., via XAMPP or MySQL command line).
2. Create and import the schema from `database.sql`:
   ```bash
   mysql -u root -p < database.sql
   ```
3. Update `.env` with your MySQL credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=donation_management
   ```

*(Note: If MySQL is not running, the application will automatically start in resilient In-Memory Mode with pre-populated demo data so you can test all features right away!)*

### 4. Run the Server
```bash
npm start
# OR
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔌 REST API Reference

### 1. Campaigns Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/campaigns` | List all campaigns with raised funds & donor count |
| `GET` | `/campaigns/:id` | Fetch single campaign profile and its donor ledger |
| `POST` | `/campaigns` | Create a new campaign (title, org, category, target, dates) |
| `PUT` | `/campaigns/:id` | Update campaign parameters (target, status, end date, desc) |
| `DELETE` | `/campaigns/:id` | Delete campaign and cascading donation records |

### 2. Donations Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/donations` | List all donation records across all campaigns |
| `GET` | `/donations/:id` | Fetch specific donation receipt by ID or Txn reference |
| `POST` | `/donations` | Record a donor contribution, update campaign progress |
| `GET` | `/donations/donor/:query` | Search donation history by donor name, email or phone |

### 3. Monitoring & System Status
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/summary` | Real-time KPIs, progress percentages & category metrics |
| `GET` | `/db-status` | Check live MySQL connectivity or demo fallback status |

---

## 🎓 Academic Evaluation Highlights
- **Front-End**: Semantic HTML5, CSS3 Glassmorphism, Responsive CSS Grid & Flexbox, Vanilla JavaScript DOM operations.
- **Back-End**: Express.js REST API, modular route handlers, session handling, body parsers.
- **Database**: MySQL relational tables (`campaigns`, `donations`, `users`) with Foreign Keys, indexed lookups, and auto-updating aggregates.
- **Resilience**: Graceful error handling, simulated instant payment workflows, and automated fallback.
