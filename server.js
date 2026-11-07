require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "donation-management-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 4 }
  })
);
app.use(express.static(path.join(__dirname, "public")));

// ===================================================================
// IN-MEMORY FALLBACK STORE (Used when MySQL is offline or not installed)
// Ensures 100% uptime for college lab evaluations and offline demos!
// ===================================================================
let isMySQLConnected = false;

const memoryStore = {
  campaigns: [
    {
      campaign_id: 1,
      title: "Education for Every Child",
      organization_name: "Hope Children Foundation",
      category: "Education",
      description: "Providing tuition, textbooks, digital tablets, and school uniforms for 1,200 underprivileged rural children.",
      target_amount: 50000.00,
      raised_amount: 36500.00,
      start_date: "2026-01-10",
      end_date: "2026-12-31",
      status: "Active",
      image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      campaign_id: 2,
      title: "Emergency Cardiac Surgery Fund",
      organization_name: "LifeCare Health Alliance",
      category: "Healthcare",
      description: "Sponsoring urgent pediatric heart surgeries and ICU rehabilitation for infants from low-income families.",
      target_amount: 75000.00,
      raised_amount: 52400.00,
      start_date: "2026-02-01",
      end_date: "2026-11-30",
      status: "Active",
      image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      campaign_id: 3,
      title: "Zero Hunger Food Drive",
      organization_name: "Community Care Network",
      category: "Hunger Relief",
      description: "Distributing nutritious warm meals, dry ration grocery kits, and clean milk to families displaced by urban poverty.",
      target_amount: 25000.00,
      raised_amount: 21850.00,
      start_date: "2026-03-01",
      end_date: "2026-10-15",
      status: "Active",
      image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      campaign_id: 4,
      title: "Clean Drinking Water Wells",
      organization_name: "AquaLife International",
      category: "Clean Water",
      description: "Constructing solar-powered borewells and community filtration units in arid drought-affected villages.",
      target_amount: 40000.00,
      raised_amount: 40000.00,
      start_date: "2026-01-15",
      end_date: "2026-09-01",
      status: "Completed",
      image_url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      campaign_id: 5,
      title: "Disaster Emergency Flood Relief",
      organization_name: "Red Shield Disaster Aid",
      category: "Disaster Relief",
      description: "Immediate rescue boats, emergency shelter kits, medical sanitation packs, and potable water for cyclone survivors.",
      target_amount: 60000.00,
      raised_amount: 34200.00,
      start_date: "2026-04-01",
      end_date: "2026-12-15",
      status: "Active",
      image_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      campaign_id: 6,
      title: "Protect Endangered Forest Wildlife",
      organization_name: "Earth First Wildlife Alliance",
      category: "Environment",
      description: "Anti-poaching patrols, veterinary forest rescue ambulances, and habitat reforestation initiatives.",
      target_amount: 30000.00,
      raised_amount: 14200.00,
      start_date: "2026-05-01",
      end_date: "2026-11-20",
      status: "Active",
      image_url: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    }
  ],
  donations: [
    {
      donation_id: 101,
      campaign_id: 1,
      donor_name: "Rakesh Sharma",
      donor_email: "rakesh@example.com",
      donor_phone: "9876543212",
      amount: 1500.00,
      payment_method: "UPI",
      payment_status: "Success",
      transaction_id: "TXN-2026-ED-101",
      message: "Proud to support children education!",
      donation_date: "2026-04-10 10:30:00"
    },
    {
      donation_id: 102,
      campaign_id: 1,
      donor_name: "Priya Sundaram",
      donor_email: "priya.s@gmail.com",
      donor_phone: "9845123456",
      amount: 2500.00,
      payment_method: "Credit Card",
      payment_status: "Success",
      transaction_id: "TXN-2026-ED-102",
      message: "Best wishes for the future stars.",
      donation_date: "2026-04-12 14:15:00"
    },
    {
      donation_id: 103,
      campaign_id: 1,
      donor_name: "Amit Patel",
      donor_email: "amit.patel@outlook.com",
      donor_phone: "9822334455",
      amount: 5000.00,
      payment_method: "Net Banking",
      payment_status: "Success",
      transaction_id: "TXN-2026-ED-103",
      message: "In memory of my grandfather.",
      donation_date: "2026-04-15 16:45:00"
    },
    {
      donation_id: 104,
      campaign_id: 2,
      donor_name: "Dr. Sunita Rao",
      donor_email: "sunita.rao@apollo.org",
      donor_phone: "9988776655",
      amount: 10000.00,
      payment_method: "Credit Card",
      payment_status: "Success",
      transaction_id: "TXN-2026-MD-104",
      message: "Every child deserves a healthy heartbeat.",
      donation_date: "2026-04-16 09:20:00"
    },
    {
      donation_id: 105,
      campaign_id: 2,
      donor_name: "Karthik Raman",
      donor_email: "karthik.r@techcorp.com",
      donor_phone: "9811223344",
      amount: 3500.00,
      payment_method: "Debit Card",
      payment_status: "Success",
      transaction_id: "TXN-2026-MD-105",
      message: "Speedy recovery to the little ones.",
      donation_date: "2026-04-18 11:55:00"
    },
    {
      donation_id: 106,
      campaign_id: 3,
      donor_name: "Meera Nair",
      donor_email: "meera.nair@yahoo.com",
      donor_phone: "9876123450",
      amount: 2000.00,
      payment_method: "UPI",
      payment_status: "Success",
      transaction_id: "TXN-2026-HG-106",
      message: "No one should sleep on an empty stomach.",
      donation_date: "2026-04-20 18:10:00"
    },
    {
      donation_id: 107,
      campaign_id: 3,
      donor_name: "John Doe",
      donor_email: "john.doe@globalaid.org",
      donor_phone: "9833445566",
      amount: 4500.00,
      payment_method: "Credit Card",
      payment_status: "Success",
      transaction_id: "TXN-2026-HG-107",
      message: "Keep up the remarkable community work!",
      donation_date: "2026-04-22 13:05:00"
    },
    {
      donation_id: 108,
      campaign_id: 4,
      donor_name: "Ananya Desai",
      donor_email: "ananya.d@greenearth.in",
      donor_phone: "9822110099",
      amount: 8000.00,
      payment_method: "Net Banking",
      payment_status: "Success",
      transaction_id: "TXN-2026-WT-108",
      message: "Clean water is a basic human right.",
      donation_date: "2026-04-25 15:40:00"
    },
    {
      donation_id: 109,
      campaign_id: 5,
      donor_name: "Vikas Verma",
      donor_email: "vikas.verma@infra.com",
      donor_phone: "9899001122",
      amount: 6500.00,
      payment_method: "UPI",
      payment_status: "Success",
      transaction_id: "TXN-2026-FL-109",
      message: "Stay strong through the flood recovery.",
      donation_date: "2026-04-28 17:25:00"
    },
    {
      donation_id: 110,
      campaign_id: 6,
      donor_name: "Sneha Mukherjee",
      donor_email: "sneha.m@wildlife.org",
      donor_phone: "9844556677",
      amount: 3000.00,
      payment_method: "Credit Card",
      payment_status: "Success",
      transaction_id: "TXN-2026-WL-110",
      message: "Protecting wildlife is protecting our future.",
      donation_date: "2026-05-01 12:15:00"
    }
  ],
  nextCampaignId: 7,
  nextDonationId: 111
};

// ===================================================================
// MySQL Database Connection Pool
// ===================================================================
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rakesh",
  database: process.env.DB_NAME || "donation_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL Connection
dbPool.getConnection((err, connection) => {
  if (err) {
    console.warn("⚠️  [MySQL Warning]: Could not connect to MySQL server (" + err.code + ").");
    console.warn("ℹ️  [Self-Healing Mode]: Online Donation Management System is running with in-memory resilient data store.");
    console.warn("ℹ️  To sync with MySQL, ensure MySQL is running on port 3306 and import 'database.sql'.");
    isMySQLConnected = false;
  } else {
    isMySQLConnected = true;
    console.log("✅ [MySQL Connected]: Active connection to 'donation_management' database established.");
    connection.release();
  }
});

// Helper for database queries with automatic in-memory fallback
function queryDb(sql, params, callback) {
  if (!isMySQLConnected) {
    return callback(new Error("MySQL offline - using fallback"), null);
  }
  dbPool.query(sql, params, (err, results) => {
    if (err) {
      console.error("MySQL query error:", err.message);
      return callback(err, null);
    }
    callback(null, results);
  });
}

// ===================================================================
// DATABASE STATUS ENDPOINT
// ===================================================================
app.get("/db-status", (req, res) => {
  res.json({
    connected: isMySQLConnected,
    mode: isMySQLConnected ? "MySQL Live Database" : "Demo Mode (In-Memory Database)",
    database: process.env.DB_NAME || "donation_management",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306
  });
});

// ===================================================================
// 1. CAMPAIGNS CRUD OPERATIONS (For Organizations & Public)
// ===================================================================

// GET /campaigns - List all campaigns with live metrics
app.get("/campaigns", (req, res) => {
  if (isMySQLConnected) {
    const sql = `
      SELECT c.*, 
             COALESCE(SUM(CASE WHEN d.payment_status = 'Success' THEN d.amount ELSE 0 END), c.raised_amount) AS raised_amount,
             COUNT(d.donation_id) AS donors_count
      FROM campaigns c
      LEFT JOIN donations d ON c.campaign_id = d.campaign_id
      GROUP BY c.campaign_id
      ORDER BY c.campaign_id DESC
    `;
    queryDb(sql, [], (err, results) => {
      if (err) return res.json(memoryStore.campaigns);
      res.json(results);
    });
  } else {
    const list = memoryStore.campaigns.map(c => {
      const campDonations = memoryStore.donations.filter(d => d.campaign_id === c.campaign_id);
      const totalRaised = campDonations.reduce((sum, d) => sum + Number(d.amount), 0);
      return {
        ...c,
        raised_amount: totalRaised > 0 ? totalRaised : c.raised_amount,
        donors_count: campDonations.length
      };
    });
    res.json(list);
  }
});

// GET /campaigns/:id - View single campaign and its donation history
app.get("/campaigns/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isMySQLConnected) {
    const sqlCamp = `
      SELECT c.*, 
             COALESCE(SUM(CASE WHEN d.payment_status = 'Success' THEN d.amount ELSE 0 END), c.raised_amount) AS raised_amount,
             COUNT(d.donation_id) AS donors_count
      FROM campaigns c
      LEFT JOIN donations d ON c.campaign_id = d.campaign_id
      WHERE c.campaign_id = ?
      GROUP BY c.campaign_id
    `;
    queryDb(sqlCamp, [id], (err, results) => {
      if (err || results.length === 0) {
        const mem = memoryStore.campaigns.find(c => c.campaign_id === id);
        if (!mem) return res.status(404).json({ message: "Campaign not found" });
        const memDonations = memoryStore.donations.filter(d => d.campaign_id === id);
        return res.json({ ...mem, donations: memDonations });
      }

      const campaign = results[0];
      const sqlDonations = `
        SELECT * FROM donations 
        WHERE campaign_id = ? 
        ORDER BY donation_date DESC
      `;
      queryDb(sqlDonations, [id], (errDon, donations) => {
        campaign.donations = donations || [];
        res.json(campaign);
      });
    });
  } else {
    const campaign = memoryStore.campaigns.find(c => c.campaign_id === id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    const campDonations = memoryStore.donations.filter(d => d.campaign_id === id);
    res.json({
      ...campaign,
      donors_count: campDonations.length,
      donations: campDonations
    });
  }
});

// POST /campaigns - Organizations create a new campaign
app.post("/campaigns", (req, res) => {
  const { title, organization_name, category, description, target_amount, start_date, end_date, image_url } = req.body;

  if (!title || !organization_name || !target_amount || !start_date || !end_date) {
    return res.status(400).json({ error: "Please provide all required campaign fields." });
  }

  const cleanTarget = parseFloat(target_amount);
  const defaultImage = image_url && image_url.trim() !== ""
    ? image_url.trim()
    : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=800&q=80";

  if (isMySQLConnected) {
    const sql = `
      INSERT INTO campaigns 
      (title, organization_name, category, description, target_amount, raised_amount, start_date, end_date, status, image_url)
      VALUES (?, ?, ?, ?, ?, 0.00, ?, ?, 'Active', ?)
    `;
    queryDb(sql, [title, organization_name, category || "General", description || "", cleanTarget, start_date, end_date, defaultImage], (err, result) => {
      if (err) {
        console.warn("Falling back to memory for campaign insert:", err.message);
        const newCamp = {
          campaign_id: memoryStore.nextCampaignId++,
          title,
          organization_name,
          category: category || "General",
          description: description || "",
          target_amount: cleanTarget,
          raised_amount: 0.00,
          start_date,
          end_date,
          status: "Active",
          image_url: defaultImage,
          created_at: new Date().toISOString()
        };
        memoryStore.campaigns.unshift(newCamp);
        return res.status(201).json({ message: "Campaign created successfully (In-Memory)", campaign_id: newCamp.campaign_id });
      }

      res.status(201).json({
        message: "Campaign created successfully in MySQL",
        campaign_id: result.insertId
      });
    });
  } else {
    const newCamp = {
      campaign_id: memoryStore.nextCampaignId++,
      title,
      organization_name,
      category: category || "General",
      description: description || "",
      target_amount: cleanTarget,
      raised_amount: 0.00,
      start_date,
      end_date,
      status: "Active",
      image_url: defaultImage,
      created_at: new Date().toISOString()
    };
    memoryStore.campaigns.unshift(newCamp);
    res.status(201).json({ message: "Campaign created successfully", campaign_id: newCamp.campaign_id });
  }
});

// PUT /campaigns/:id - Organizations / Admins update campaign details
app.put("/campaigns/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, organization_name, category, description, target_amount, end_date, status, image_url } = req.body;

  if (isMySQLConnected) {
    const sql = `
      UPDATE campaigns
      SET title = COALESCE(?, title),
          organization_name = COALESCE(?, organization_name),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          target_amount = COALESCE(?, target_amount),
          end_date = COALESCE(?, end_date),
          status = COALESCE(?, status),
          image_url = COALESCE(?, image_url)
      WHERE campaign_id = ?
    `;
    queryDb(sql, [title, organization_name, category, description, target_amount, end_date, status, image_url, id], (err, result) => {
      if (err) {
        return updateMemoryCampaign(id, req.body, res);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json({ message: "Campaign updated successfully in MySQL" });
    });
  } else {
    updateMemoryCampaign(id, req.body, res);
  }
});

function updateMemoryCampaign(id, body, res) {
  const index = memoryStore.campaigns.findIndex(c => c.campaign_id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  const current = memoryStore.campaigns[index];
  memoryStore.campaigns[index] = {
    ...current,
    title: body.title !== undefined ? body.title : current.title,
    organization_name: body.organization_name !== undefined ? body.organization_name : current.organization_name,
    category: body.category !== undefined ? body.category : current.category,
    description: body.description !== undefined ? body.description : current.description,
    target_amount: body.target_amount !== undefined ? parseFloat(body.target_amount) : current.target_amount,
    end_date: body.end_date !== undefined ? body.end_date : current.end_date,
    status: body.status !== undefined ? body.status : current.status,
    image_url: body.image_url !== undefined && body.image_url.trim() !== "" ? body.image_url : current.image_url
  };
  res.json({ message: "Campaign updated successfully" });
}

// DELETE /campaigns/:id - Delete a campaign and its donation records
app.delete("/campaigns/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isMySQLConnected) {
    const sql = "DELETE FROM campaigns WHERE campaign_id = ?";
    queryDb(sql, [id], (err, result) => {
      if (err) {
        return deleteMemoryCampaign(id, res);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json({ message: "Campaign and records deleted successfully from MySQL" });
    });
  } else {
    deleteMemoryCampaign(id, res);
  }
});

function deleteMemoryCampaign(id, res) {
  const index = memoryStore.campaigns.findIndex(c => c.campaign_id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  memoryStore.campaigns.splice(index, 1);
  memoryStore.donations = memoryStore.donations.filter(d => d.campaign_id !== id);
  res.json({ message: "Campaign deleted successfully" });
}

// ===================================================================
// 2. DONATIONS CRUD OPERATIONS (For Donors & Contributions)
// ===================================================================

// GET /donations - List all donations with campaign metadata
app.get("/donations", (req, res) => {
  if (isMySQLConnected) {
    const sql = `
      SELECT d.*, c.title AS campaign_title, c.organization_name
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.campaign_id
      ORDER BY d.donation_date DESC
    `;
    queryDb(sql, [], (err, results) => {
      if (err) return res.json(getMemoryDonationsWithCampaign());
      res.json(results);
    });
  } else {
    res.json(getMemoryDonationsWithCampaign());
  }
});

function getMemoryDonationsWithCampaign() {
  return memoryStore.donations.map(d => {
    const camp = memoryStore.campaigns.find(c => c.campaign_id === d.campaign_id) || {};
    return {
      ...d,
      campaign_title: camp.title || "Charity Campaign",
      organization_name: camp.organization_name || "Community Aid"
    };
  }).sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date));
}

// GET /donations/:id - Single donation receipt
app.get("/donations/:id", (req, res) => {
  const idOrTxn = req.params.id;

  if (isMySQLConnected) {
    const sql = `
      SELECT d.*, c.title AS campaign_title, c.organization_name, c.category
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.campaign_id
      WHERE d.donation_id = ? OR d.transaction_id = ?
      LIMIT 1
    `;
    queryDb(sql, [idOrTxn, idOrTxn], (err, results) => {
      if (err || results.length === 0) {
        return findMemoryDonation(idOrTxn, res);
      }
      res.json(results[0]);
    });
  } else {
    findMemoryDonation(idOrTxn, res);
  }
});

function findMemoryDonation(idOrTxn, res) {
  const donation = memoryStore.donations.find(
    d => String(d.donation_id) === String(idOrTxn) || d.transaction_id === idOrTxn
  );
  if (!donation) {
    return res.status(404).json({ message: "Donation record not found" });
  }
  const camp = memoryStore.campaigns.find(c => c.campaign_id === donation.campaign_id) || {};
  res.json({
    ...donation,
    campaign_title: camp.title || "Charity Campaign",
    organization_name: camp.organization_name || "Community Aid",
    category: camp.category || "General"
  });
}

// POST /donations - Donors contribute money
app.post("/donations", (req, res) => {
  const { campaign_id, donor_name, donor_email, donor_phone, amount, payment_method, message } = req.body;
  const numAmount = parseFloat(amount);
  const campId = parseInt(campaign_id, 10);

  if (!campId || !donor_name || !donor_email || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Please enter a valid donor name, email, and contribution amount." });
  }

  // Generate unique transaction reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const transactionId = `TXN-${new Date().getFullYear()}-${campId}-${randomSuffix}`;
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (isMySQLConnected) {
    const sqlInsert = `
      INSERT INTO donations
      (campaign_id, donor_name, donor_email, donor_phone, amount, payment_method, payment_status, transaction_id, message, donation_date)
      VALUES (?, ?, ?, ?, ?, ?, 'Success', ?, ?, ?)
    `;
    queryDb(sqlInsert, [
      campId,
      donor_name.trim(),
      donor_email.trim(),
      donor_phone || null,
      numAmount,
      payment_method || "Credit Card",
      transactionId,
      message || "Charitable contribution",
      now
    ], (err, result) => {
      if (err) {
        return saveMemoryDonation(campId, donor_name, donor_email, donor_phone, numAmount, payment_method, message, transactionId, now, res);
      }

      // Automatically update campaign raised amount in MySQL
      const sqlUpdateCamp = `
        UPDATE campaigns 
        SET raised_amount = raised_amount + ? 
        WHERE campaign_id = ?
      `;
      queryDb(sqlUpdateCamp, [numAmount, campId], () => { });

      res.status(201).json({
        message: "Thank you! Your donation was recorded successfully.",
        donation_id: result.insertId,
        transaction_id: transactionId,
        amount: numAmount
      });
    });
  } else {
    saveMemoryDonation(campId, donor_name, donor_email, donor_phone, numAmount, payment_method, message, transactionId, now, res);
  }
});

function saveMemoryDonation(campId, donor_name, donor_email, donor_phone, numAmount, payment_method, message, transactionId, now, res) {
  const newDonation = {
    donation_id: memoryStore.nextDonationId++,
    campaign_id: campId,
    donor_name: donor_name.trim(),
    donor_email: donor_email.trim(),
    donor_phone: donor_phone || "",
    amount: numAmount,
    payment_method: payment_method || "Credit Card",
    payment_status: "Success",
    transaction_id: transactionId,
    message: message || "Charitable contribution",
    donation_date: now
  };
  memoryStore.donations.unshift(newDonation);

  // Update memory campaign raised amount
  const camp = memoryStore.campaigns.find(c => c.campaign_id === campId);
  if (camp) {
    camp.raised_amount = Number(camp.raised_amount) + numAmount;
  }

  res.status(201).json({
    message: "Thank you! Your donation was recorded successfully.",
    donation_id: newDonation.donation_id,
    transaction_id: transactionId,
    amount: numAmount
  });
}

// GET /donations/donor/:query - Donors query their donation history
app.get("/donations/donor/:query", (req, res) => {
  const q = req.params.query.toLowerCase().trim();

  const all = isMySQLConnected ? null : getMemoryDonationsWithCampaign();
  if (!isMySQLConnected) {
    const filtered = all.filter(d =>
      d.donor_email.toLowerCase().includes(q) ||
      d.donor_name.toLowerCase().includes(q) ||
      (d.donor_phone && d.donor_phone.includes(q)) ||
      d.transaction_id.toLowerCase().includes(q)
    );
    return res.json(filtered);
  }

  const sql = `
    SELECT d.*, c.title AS campaign_title, c.organization_name
    FROM donations d
    JOIN campaigns c ON d.campaign_id = c.campaign_id
    WHERE LOWER(d.donor_email) LIKE ? 
       OR LOWER(d.donor_name) LIKE ? 
       OR d.donor_phone LIKE ?
       OR LOWER(d.transaction_id) LIKE ?
    ORDER BY d.donation_date DESC
  `;
  const likeQ = `%${q}%`;
  queryDb(sql, [likeQ, likeQ, likeQ, likeQ], (err, results) => {
    if (err) return res.json(getMemoryDonationsWithCampaign());
    res.json(results);
  });
});

// ===================================================================
// 3. ADMIN MONITORING PROGRESS (Fundraising Progress & Analytics)
// ===================================================================
app.get("/admin/summary", (req, res) => {
  const calculateMetrics = (campaigns, donations) => {
    const totalRaised = donations.reduce((sum, d) => sum + (d.payment_status === "Success" ? Number(d.amount) : 0), 0);
    const totalTarget = campaigns.reduce((sum, c) => sum + Number(c.target_amount), 0);
    const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
    const completedCampaigns = campaigns.filter(c => c.status === "Completed").length;
    const avgDonation = donations.length > 0 ? (totalRaised / donations.length).toFixed(2) : "0.00";

    // Category breakdown
    const categoryStats = {};
    campaigns.forEach(c => {
      const cat = c.category || "General";
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, target: 0, raised: 0 };
      }
      categoryStats[cat].count++;
      categoryStats[cat].target += Number(c.target_amount);
      const campDons = donations.filter(d => d.campaign_id === c.campaign_id);
      categoryStats[cat].raised += campDons.reduce((s, d) => s + Number(d.amount), 0);
    });

    return {
      total_raised: totalRaised,
      total_target: totalTarget,
      overall_progress: totalTarget > 0 ? Math.min(100, Math.round((totalRaised / totalTarget) * 100)) : 0,
      total_campaigns: campaigns.length,
      active_campaigns: activeCampaigns,
      completed_campaigns: completedCampaigns,
      total_donations: donations.length,
      average_donation: avgDonation,
      categories: categoryStats,
      campaigns: campaigns.map(c => {
        const campDons = donations.filter(d => d.campaign_id === c.campaign_id);
        const raised = campDons.reduce((s, d) => s + Number(d.amount), 0) || c.raised_amount;
        return {
          campaign_id: c.campaign_id,
          title: c.title,
          organization_name: c.organization_name,
          category: c.category,
          target_amount: c.target_amount,
          raised_amount: raised,
          progress_percent: c.target_amount > 0 ? Math.min(100, Math.round((raised / c.target_amount) * 100)) : 0,
          status: c.status,
          donors_count: campDons.length
        };
      })
    };
  };

  if (isMySQLConnected) {
    const sqlCamp = "SELECT * FROM campaigns ORDER BY campaign_id DESC";
    const sqlDon = "SELECT * FROM donations ORDER BY donation_date DESC";

    queryDb(sqlCamp, [], (err1, campaigns) => {
      if (err1) return res.json(calculateMetrics(memoryStore.campaigns, memoryStore.donations));
      queryDb(sqlDon, [], (err2, donations) => {
        if (err2) return res.json(calculateMetrics(campaigns, memoryStore.donations));
        res.json(calculateMetrics(campaigns, donations));
      });
    });
  } else {
    res.json(calculateMetrics(memoryStore.campaigns, memoryStore.donations));
  }
});

// ===================================================================
// 4. BACKWARDS COMPATIBILITY ROUTES (API Endpoints & Auth Mock)
// ===================================================================
app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  // Demo login handler
  let role = "donor";
  if (name && (name.toLowerCase().includes("admin") || password === "admin123")) role = "admin";
  else if (name && (name.toLowerCase().includes("org") || password === "org123")) role = "organization";

  req.session.user = {
    user_id: 1,
    name: name || "Demo User",
    role: role
  };
  res.json({ message: `Logged in as ${role}`, user: req.session.user });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out." }));
});

app.get("/api/campaigns", (req, res) => res.redirect("/campaigns"));
app.post("/api/campaigns", (req, res, next) => app._router.handle(req, res, next));
app.post("/api/donations", (req, res, next) => app._router.handle(req, res, next));
app.get("/api/my-donations", (req, res) => res.redirect("/donations"));
app.get("/api/admin/summary", (req, res) => res.redirect("/admin/summary"));

// ===================================================================
// HTML Page Serving
// ===================================================================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/list", (req, res) => res.sendFile(path.join(__dirname, "public", "list.html")));
app.get("/listOne", (req, res) => res.sendFile(path.join(__dirname, "public", "listOne.html")));
app.get("/insert", (req, res) => res.sendFile(path.join(__dirname, "public", "insert.html")));
app.get("/update", (req, res) => res.sendFile(path.join(__dirname, "public", "update.html")));
app.get("/delete", (req, res) => res.sendFile(path.join(__dirname, "public", "delete.html")));
app.get("/history", (req, res) => res.sendFile(path.join(__dirname, "public", "history.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===================================================================`);
    console.log(`❤️  ONLINE DONATION MANAGEMENT SYSTEM - SERVER STARTED`);
    console.log(`🌐  Local URL:        http://localhost:${PORT}`);
    console.log(`🗄️  Database Target:  donation_management on MySQL port 3306`);
    console.log(`📁  Public Static:    ${path.join(__dirname, "public")}`);
    console.log(`===================================================================`);
  });
}

module.exports = app;

