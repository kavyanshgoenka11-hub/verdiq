require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken, requireRole, } = require("./middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// File upload configuration
const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
app.use("/uploads", express.static(uploadDirectory));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Basic backend test
app.get("/", (req, res) => {
  res.json({
    message: "Verdiq backend is running",
  });
});

// Database connection test
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      backend: "online",
      database: rows[0].connected === 1 ? "connected" : "error",
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      backend: "online",
      database: "disconnected",
    });
  }
});

// User registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, organization, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required.",
      });
    }

    // Only allow safe self-registration roles
    const allowedRoles = ["buyer", "developer"];

    const userRole = allowedRoles.includes(role) ? role : "buyer";

    // Check whether the email already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // Hash the password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert the user
    const [result] = await db.query(
      `INSERT INTO users
        (name, organization, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, organization || null, email, passwordHash, userRole]
    );

    res.status(201).json({
      message: "Registration successful.",
      user: {
        id: result.insertId,
        name,
        organization: organization || null,
        email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      error: "Failed to register user.",
    });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    // Find user by email
    const [users] = await db.query(
      `SELECT id, name, organization, email, password_hash, role, status
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const user = users[0];

    // Check whether the account is active
    if (user.status !== "active") {
      return res.status(403).json({
        error: "Your account is inactive.",
      });
    }

    // Compare entered password with stored bcrypt hash
    const passwordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordValid) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // Create JWT without sensitive information
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        organization: user.organization,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      error: "Failed to process login.",
    });
  }
});

// Public: Verdiq network overview
app.get(
  "/api/public/overview",
  async (req, res) => {
    try {
      const [userRows] = await db.query(
        `SELECT COUNT(*) AS total_users
         FROM users`
      );

      const [projectRows] = await db.query(
        `SELECT COUNT(*) AS total_projects
         FROM projects`
      );

      const [creditRows] = await db.query(
        `SELECT
           COALESCE(SUM(quantity), 0) AS total_credits
         FROM credits`
      );

      const [availableRows] = await db.query(
        `SELECT
           COALESCE(SUM(remaining_quantity), 0) AS available_credits
         FROM marketplace_listings
         WHERE status = 'active'`
      );

      const [retirementRows] = await db.query(
        `SELECT
           COALESCE(SUM(quantity), 0) AS total_retired
         FROM retirements`
      );

      const [verifiedProjectRows] = await db.query(
        `SELECT COUNT(*) AS verified_projects
         FROM projects
         WHERE status = 'verified'`
      );

      res.json({
        total_users: Number(
          userRows[0].total_users
        ),

        total_projects: Number(
          projectRows[0].total_projects
        ),

        verified_projects: Number(
          verifiedProjectRows[0].verified_projects
        ),

        total_credits: Number(
          creditRows[0].total_credits
        ),

        available_credits: Number(
          availableRows[0].available_credits
        ),

        total_retired: Number(
          retirementRows[0].total_retired
        ),
      });
    } catch (error) {
      console.error(
        "Public overview error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load public platform overview.",
      });
    }
  }
);

// Public: participating organization climate leaderboard
app.get(
  "/api/public/leaderboard",
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT
          u.id AS user_id,
          u.name,
          u.organization,

          fr.reporting_year,
          fr.scope1_emissions,
          fr.scope2_emissions,
          fr.scope3_emissions,
          fr.total_emissions

         FROM footprint_reports fr

         INNER JOIN users u
           ON fr.user_id = u.id

         WHERE fr.status = 'finalized'

           AND fr.reporting_year = (
             SELECT MAX(fr2.reporting_year)
             FROM footprint_reports fr2
             WHERE fr2.user_id = fr.user_id
               AND fr2.status = 'finalized'
           )

         ORDER BY fr.total_emissions DESC`
      );

      const leaderboard = rows.map(
        (row, index) => ({
          rank: index + 1,

          user_id: row.user_id,

          organization:
            row.organization ||
            row.name,

          reporting_year:
            Number(row.reporting_year),

          scope1: Number(
            row.scope1_emissions
          ),

          scope2: Number(
            row.scope2_emissions
          ),

          scope3: Number(
            row.scope3_emissions
          ),

          total_emissions: Number(
            row.total_emissions
          ),
        })
      );

      res.json({
        leaderboard,
      });
    } catch (error) {
      console.error(
        "Public leaderboard error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load climate leaderboard.",
      });
    }
  }
);

// Public: aggregate emissions by scope
app.get(
  "/api/public/scope-breakdown",
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT
          COALESCE(SUM(scope1_emissions), 0) AS scope1,
          COALESCE(SUM(scope2_emissions), 0) AS scope2,
          COALESCE(SUM(scope3_emissions), 0) AS scope3
         FROM footprint_reports
         WHERE status = 'finalized'`
      );

      res.json({
        scope1: Number(rows[0].scope1),
        scope2: Number(rows[0].scope2),
        scope3: Number(rows[0].scope3),
      });
    } catch (error) {
      console.error(
        "Public scope breakdown error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load emissions by scope.",
      });
    }
  }
);

// Public: featured verified projects
app.get(
  "/api/public/projects",
  async (req, res) => {
    try {
      const [projects] = await db.query(
        `SELECT
          p.id,
          p.name,
          p.project_type,
          p.location,
          p.description,
          p.expected_credits,
          p.approved_issuance_quantity,

          COALESCE(
            SUM(
              CASE
                WHEN ml.status = 'active'
                THEN ml.remaining_quantity
                ELSE 0
              END
            ),
            0
          ) AS available_credits

         FROM projects p

         LEFT JOIN credits c
           ON c.project_id = p.id

         LEFT JOIN marketplace_listings ml
           ON ml.credit_id = c.id

         WHERE p.status = 'verified'

         GROUP BY
           p.id,
           p.name,
           p.project_type,
           p.location,
           p.description,
           p.expected_credits,
           p.approved_issuance_quantity

         ORDER BY p.id DESC
         LIMIT 6`
      );

      res.json({
        projects: projects.map(
          (project) => ({
            id: project.id,
            name: project.name,
            project_type:
              project.project_type,
            location: project.location,
            description:
              project.description,
            expected_credits: Number(
              project.expected_credits
            ),
            approved_issuance_quantity:
              project.approved_issuance_quantity !==
              null
                ? Number(
                    project.approved_issuance_quantity
                  )
                : null,
            available_credits: Number(
              project.available_credits
            ),
          })
        ),
      });
    } catch (error) {
      console.error(
        "Public projects error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load verified projects.",
      });
    }
  }
);

// Admin: create a new user
app.post(
  "/api/admin/users",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const {
        name,
        organization,
        email,
        password,
        role,
      } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: "Name, email, password, and role are required.",
        });
      }

      // Admin can create any supported role
      const allowedRoles = [
        "buyer",
        "developer",
        "auditor",
        "admin",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          error: "Invalid user role.",
        });
      }

      // Check duplicate email
      const [existingUsers] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          error: "An account with this email already exists.",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const [result] = await db.query(
        `INSERT INTO users
          (name, organization, email, password_hash, role)
         VALUES (?, ?, ?, ?, ?)`,
        [
          name,
          organization || null,
          email,
          passwordHash,
          role,
        ]
      );

      res.status(201).json({
        message: "User created successfully.",
        user: {
          id: result.insertId,
          name,
          organization: organization || null,
          email,
          role,
        },
      });
    } catch (error) {
      console.error("Admin user creation error:", error.message);

      res.status(500).json({
        error: "Failed to create user.",
      });
    }
  }
);

// Developer: create a new project
app.post(
  "/api/developer/projects",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    try {
      const {
        name,
        project_type,
        location,
        description,
        expected_credits,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !project_type ||
        !location ||
        expected_credits === undefined
      ) {
        return res.status(400).json({
          error:
            "Project name, project type, location, and expected credits are required.",
        });
      }

      const expectedCredits = Number(expected_credits);

      if (
        Number.isNaN(expectedCredits) ||
        expectedCredits < 0
      ) {
        return res.status(400).json({
          error: "Expected credits must be a valid non-negative number.",
        });
      }

      // The developer ID comes from the verified JWT,
      // not from the request body.
      const developerId = req.user.id;

      const [result] = await db.query(
        `INSERT INTO projects
          (
            developer_id,
            name,
            project_type,
            location,
            description,
            expected_credits,
            status
          )
         VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
        [
          developerId,
          name,
          project_type,
          location,
          description || null,
          expectedCredits,
        ]
      );

      res.status(201).json({
        message: "Project created successfully.",
        project: {
          id: result.insertId,
          developer_id: developerId,
          name,
          project_type,
          location,
          description: description || null,
          expected_credits: expectedCredits,
          status: "draft",
        },
      });
    } catch (error) {
      console.error("Project creation error:", error.message);

      res.status(500).json({
        error: "Failed to create project.",
      });
    }
  }
);

// Developer: view own projects
app.get(
  "/api/developer/projects",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    try {
      const developerId = req.user.id;

      const [projects] = await db.query(
        `SELECT
          id,
          name,
          project_type,
          location,
          description,
          expected_credits,
          status,
          submitted_at,
          created_at
         FROM projects
         WHERE developer_id = ?
         ORDER BY created_at DESC`,
        [developerId]
      );

      res.json({
        projects,
      });
    } catch (error) {
      console.error(
        "Error fetching developer projects:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch developer projects.",
      });
    }
  }
);

// Developer: view documents for own project
app.get(
  "/api/developer/projects/:id/documents",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const developerId = req.user.id;

      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      const [projects] = await db.query(
        `SELECT id
         FROM projects
         WHERE id = ? AND developer_id = ?`,
        [projectId, developerId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const [documents] = await db.query(
        `SELECT
          id,
          document_name,
          document_type,
          file_url,
          uploaded_at
         FROM project_documents
         WHERE project_id = ?
         ORDER BY uploaded_at DESC`,
        [projectId]
      );

      res.json({
        documents,
      });
    } catch (error) {
      console.error(
        "Error fetching project documents:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch project documents.",
      });
    }
  }
);

// Developer: view own issued credit batches and marketplace listings
app.get(
  "/api/developer/credits",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    try {
      const developerId = req.user.id;

      const [credits] = await db.query(
        `SELECT
          c.id,
          c.project_id,
          c.serial_number,
          c.quantity,
          c.available_quantity,
          c.retired_quantity,
          c.status,
          c.issued_at,

          p.name AS project_name,
          p.project_type,
          p.location,

          ml.id AS listing_id,
          ml.quantity AS listed_quantity,
          ml.remaining_quantity,
          ml.price_per_credit AS listing_price,
          ml.status AS listing_status,
          ml.listed_at

         FROM credits c

         INNER JOIN projects p
           ON c.project_id = p.id

         LEFT JOIN marketplace_listings ml
           ON ml.credit_id = c.id
          AND ml.status = 'active'

         WHERE p.developer_id = ?

         ORDER BY c.issued_at DESC`,
        [developerId]
      );

      res.json({
        credits: credits.map((credit) => ({
          id: credit.id,
          project_id: credit.project_id,
          serial_number: credit.serial_number,

          quantity: Number(credit.quantity),
          available_quantity: Number(
            credit.available_quantity
          ),
          retired_quantity: Number(
            credit.retired_quantity
          ),

          status: credit.status,
          issued_at: credit.issued_at,

          project_name: credit.project_name,
          project_type: credit.project_type,
          location: credit.location,

          listing_id:
            credit.listing_id !== null
              ? Number(credit.listing_id)
              : null,

          listed_quantity:
            credit.listed_quantity !== null
              ? Number(
                  credit.listed_quantity
                )
              : null,

          remaining_quantity:
            credit.remaining_quantity !== null
              ? Number(
                  credit.remaining_quantity
                )
              : null,

          listing_price:
            credit.listing_price !== null
              ? Number(
                  credit.listing_price
                )
              : null,

          listing_status:
            credit.listing_status || null,

          listed_at:
            credit.listed_at || null,
        })),
      });
    } catch (error) {
      console.error(
        "Error fetching developer credits:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to fetch developer credit inventory.",
      });
    }
  }
);


// Developer: list an issued credit batch for sale
app.patch(
  "/api/developer/credits/:id/list",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const creditId = Number(req.params.id);
      const developerId = req.user.id;

      const { price_per_credit } = req.body;

      // Validate credit ID
      if (
        !Number.isInteger(creditId) ||
        creditId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid credit ID.",
        });
      }

      // Validate price
      const price = Number(price_per_credit);

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        return res.status(400).json({
          error:
            "Price per credit must be greater than 0.",
        });
      }

      await connection.beginTransaction();

      /*
       * Lock the credit row while creating the listing.
       * This prevents two listing requests from using the
       * same inventory simultaneously.
       */
      const [credits] = await connection.query(
        `SELECT
          c.id,
          c.project_id,
          c.quantity,
          c.available_quantity,
          c.status,
          p.name AS project_name,
          p.status AS project_status,
          p.developer_id

         FROM credits c

         INNER JOIN projects p
           ON c.project_id = p.id

         WHERE c.id = ?
           AND p.developer_id = ?

         FOR UPDATE`,
        [creditId, developerId]
      );

      if (credits.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          error:
            "Credit batch not found or does not belong to you.",
        });
      }

      const credit = credits[0];

      // Only verified projects can have marketplace listings
      if (credit.project_status !== "verified") {
        await connection.rollback();

        return res.status(400).json({
          error:
            "Only verified project credits can be listed.",
        });
      }

      // Credit batch must actually contain available credits
      const availableQuantity = Number(
        credit.available_quantity
      );

      if (
        !Number.isFinite(availableQuantity) ||
        availableQuantity <= 0
      ) {
        await connection.rollback();

        return res.status(400).json({
          error:
            "No available credits remain in this batch.",
        });
      }

      /*
       * For this prototype, one credit batch has one active
       * marketplace listing containing the currently available
       * inventory. This keeps inventory accounting simple and safe.
       */
      const [existingListings] =
        await connection.query(
          `SELECT
            id,
            status,
            remaining_quantity
           FROM marketplace_listings
           WHERE credit_id = ?
             AND status = 'active'
           LIMIT 1
           FOR UPDATE`,
          [creditId]
        );

      if (existingListings.length > 0) {
        await connection.rollback();

        return res.status(409).json({
          error:
            "This credit batch is already listed for sale.",
        });
      }

      // Create marketplace listing
      const [result] = await connection.query(
        `INSERT INTO marketplace_listings
          (
            credit_id,
            seller_id,
            quantity,
            remaining_quantity,
            price_per_credit,
            status,
            listed_at
          )
         VALUES (?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)`,
        [
          creditId,
          developerId,
          availableQuantity,
          availableQuantity,
          price,
        ]
      );

      await connection.commit();

      res.status(201).json({
        message:
          "Credit batch listed for sale successfully.",

        listing: {
          id: result.insertId,
          credit_id: creditId,
          seller_id: developerId,
          project_name: credit.project_name,

          quantity: availableQuantity,
          remaining_quantity: availableQuantity,

          price_per_credit: price,
          status: "active",
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Credit listing error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to list credit batch for sale.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);



// Developer: upload a supporting project document
app.post(
  "/api/developer/projects/:id/documents",
  authenticateToken,
  requireRole("developer"),
  upload.single("document"),
  async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const developerId = req.user.id;

      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      // A file must be provided
      if (!req.file) {
        return res.status(400).json({
          error: "Please select a document to upload.",
        });
      }

      // Make sure the project belongs to the logged-in developer
      const [projects] = await db.query(
        `SELECT id, status
         FROM projects
         WHERE id = ? AND developer_id = ?`,
        [projectId, developerId]
      );

      if (projects.length === 0) {
        // Remove the uploaded file if the project is invalid
        fs.unlinkSync(req.file.path);

        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = projects[0];

      // Don't allow uploads after verification
      if (project.status === "verified") {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          error: "Documents cannot be uploaded after project verification.",
        });
      }

      const documentName = req.file.originalname;
      const documentType = req.file.mimetype;
      const fileUrl = `/uploads/${req.file.filename}`;

      const [result] = await db.query(
        `INSERT INTO project_documents
          (project_id, document_name, document_type, file_url)
         VALUES (?, ?, ?, ?)`,
        [
          projectId,
          documentName,
          documentType,
          fileUrl,
        ]
      );

      res.status(201).json({
        message: "Document uploaded successfully.",
        document: {
          id: result.insertId,
          project_id: projectId,
          document_name: documentName,
          document_type: documentType,
          file_url: fileUrl,
        },
      });
    } catch (error) {
      console.error(
        "Document upload error:",
        error.message
      );

      // Remove uploaded file if database insertion fails
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        error: "Failed to upload document.",
      });
    }
  }
);

// Developer: submit project for verification
app.patch(
  "/api/developer/projects/:id/submit",
  authenticateToken,
  requireRole("developer"),
  async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const developerId = req.user.id;

      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      // Make sure this project belongs to the logged-in developer
      const [projects] = await db.query(
        `SELECT id, status
         FROM projects
         WHERE id = ? AND developer_id = ?`,
        [projectId, developerId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = projects[0];

      if (project.status !== "draft") {
        return res.status(400).json({
          error: "Only draft projects can be submitted.",
        });
      }

      await db.query(
        `UPDATE projects
         SET status = 'under_review',
             submitted_at = CURRENT_TIMESTAMP
         WHERE id = ? AND developer_id = ?`,
        [projectId, developerId]
      );

      res.json({
        message: "Project submitted for verification.",
        project: {
          id: projectId,
          status: "under_review",
        },
      });
    } catch (error) {
      console.error("Project submission error:", error.message);

      res.status(500).json({
        error: "Failed to submit project.",
      });
    }
  }
);

// Public: view active marketplace listings
app.get(
  "/api/marketplace/credits",
  async (req, res) => {
    try {
      const [listings] = await db.query(
        `SELECT
          ml.id AS listing_id,
          ml.credit_id,
          ml.seller_id,
          ml.quantity AS listed_quantity,
          ml.remaining_quantity,
          ml.price_per_credit,
          ml.status AS listing_status,
          ml.listed_at,

          c.serial_number,
          c.quantity AS issued_quantity,
          c.available_quantity,
          c.retired_quantity,
          c.issued_at,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location,
          p.description,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status AS project_status,

          u.name AS developer_name,
          u.organization AS developer_organization

         FROM marketplace_listings ml

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         INNER JOIN users u
           ON ml.seller_id = u.id

         WHERE ml.status = 'active'
           AND ml.remaining_quantity > 0
           AND p.status = 'verified'

         ORDER BY ml.listed_at DESC`
      );

      const credits = listings.map((listing) => ({
        id: listing.credit_id,
        listing_id: listing.listing_id,
        project_id: listing.project_id,

        serial_number: listing.serial_number,

        quantity: Number(listing.issued_quantity),
        available_quantity: Number(
          listing.remaining_quantity
        ),
        retired_quantity: Number(
          listing.retired_quantity
        ),

        price_per_credit: Number(
          listing.price_per_credit
        ),

        status: listing.listing_status,
        issued_at: listing.issued_at,
        listed_at: listing.listed_at,

        project_name: listing.project_name,
        project_type: listing.project_type,
        location: listing.location,
        description: listing.description,

        developer_name: listing.developer_name,
        developer_organization:
          listing.developer_organization,

        expected_credits: Number(
          listing.expected_credits
        ),

        approved_issuance_quantity:
          listing.approved_issuance_quantity !== null
            ? Number(
                listing.approved_issuance_quantity
              )
            : null,
      }));

      res.json({
        credits,
      });
    } catch (error) {
      console.error(
        "Marketplace listings error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load marketplace listings.",
      });
    }
  }
);

// Public: view a single active marketplace listing
app.get(
  "/api/marketplace/credits/:id",
  async (req, res) => {
    try {
      const listingId = Number(req.params.id);

      if (
        !Number.isInteger(listingId) ||
        listingId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid marketplace listing ID.",
        });
      }

      const [listings] = await db.query(
        `SELECT
          ml.id AS listing_id,
          ml.credit_id,
          ml.seller_id,
          ml.quantity AS listed_quantity,
          ml.remaining_quantity,
          ml.price_per_credit,
          ml.status AS listing_status,
          ml.listed_at,

          c.serial_number,
          c.quantity AS issued_quantity,
          c.available_quantity AS credit_available_quantity,
          c.retired_quantity,
          c.issued_at,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location,
          p.description,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status AS project_status,

          u.id AS owner_id,
          u.name AS developer_name,
          u.organization AS developer_organization,
          u.email AS developer_email

         FROM marketplace_listings ml

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         INNER JOIN users u
           ON ml.seller_id = u.id

         WHERE ml.id = ?
           AND ml.status = 'active'
           AND ml.remaining_quantity > 0
           AND p.status = 'verified'`,
        [listingId]
      );

      if (listings.length === 0) {
        return res.status(404).json({
          error:
            "Marketplace listing not found.",
        });
      }

      const listing = listings[0];

      const [documents] = await db.query(
        `SELECT
          id,
          document_name,
          document_type,
          file_url,
          uploaded_at
         FROM project_documents
         WHERE project_id = ?
         ORDER BY uploaded_at DESC`,
        [listing.project_id]
      );

      res.json({
        credit: {
          id: listing.credit_id,
          listing_id: listing.listing_id,
          project_id: listing.project_id,

          serial_number: listing.serial_number,

          quantity: Number(
            listing.issued_quantity
          ),

          available_quantity: Number(
            listing.remaining_quantity
          ),

          retired_quantity: Number(
            listing.retired_quantity
          ),

          price_per_credit: Number(
            listing.price_per_credit
          ),

          status: listing.listing_status,
          issued_at: listing.issued_at,
          listed_at: listing.listed_at,

          project: {
            id: listing.project_id,
            name: listing.project_name,
            project_type:
              listing.project_type,
            location: listing.location,
            description:
              listing.description,

            expected_credits: Number(
              listing.expected_credits
            ),

            approved_issuance_quantity:
              listing.approved_issuance_quantity !==
              null
                ? Number(
                    listing.approved_issuance_quantity
                  )
                : null,

            status:
              listing.project_status,
          },

          owner: {
            id: listing.owner_id,
            name: listing.developer_name,
            organization:
              listing.developer_organization,
            email: listing.developer_email,
          },

          documents,
        },
      });
    } catch (error) {
      console.error(
        "Marketplace detail error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load marketplace listing details.",
      });
    }
  }
);

// Buyer: create and save a calculated footprint report
app.post(
  "/api/buyer/footprint-reports",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const buyerId = req.user.id;

      const {
        reporting_year,
        scope1,
        scope2,
        scope3,
        inputs,
      } = req.body;

      const year = Number(reporting_year);

      if (
        !Number.isInteger(year) ||
        year < 2000 ||
        year > 2100
      ) {
        return res.status(400).json({
          error: "Invalid reporting year.",
        });
      }

      const scope1Value = Number(scope1);
      const scope2Value = Number(scope2);
      const scope3Value = Number(scope3);

      if (
        !Number.isFinite(scope1Value) ||
        !Number.isFinite(scope2Value) ||
        !Number.isFinite(scope3Value) ||
        scope1Value < 0 ||
        scope2Value < 0 ||
        scope3Value < 0
      ) {
        return res.status(400).json({
          error:
            "Scope emissions must be valid non-negative numbers.",
        });
      }

      if (!Array.isArray(inputs)) {
        return res.status(400).json({
          error: "Footprint inputs must be provided.",
        });
      }

      const total =
        scope1Value +
        scope2Value +
        scope3Value;

      await connection.beginTransaction();

      const [reportResult] = await connection.query(
        `INSERT INTO footprint_reports
          (
            user_id,
            reporting_year,
            scope1_emissions,
            scope2_emissions,
            scope3_emissions,
            total_emissions,
            status
          )
         VALUES (?, ?, ?, ?, ?, ?, 'calculated')`,
        [
          buyerId,
          year,
          scope1Value,
          scope2Value,
          scope3Value,
          total,
        ]
      );

      const reportId = reportResult.insertId;

      for (const input of inputs) {
        const {
          scope,
          category,
          quantity,
          unit,
          emission_factor,
          calculated_emissions,
        } = input;

        if (
          !["scope1", "scope2", "scope3"].includes(scope)
        ) {
          await connection.rollback();

          return res.status(400).json({
            error: `Invalid scope: ${scope}`,
          });
        }

        await connection.query(
          `INSERT INTO footprint_inputs
            (
              report_id,
              scope,
              category,
              quantity,
              unit,
              emission_factor,
              calculated_emissions
            )
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            reportId,
            scope,
            category,
            Number(quantity),
            unit,
            Number(emission_factor),
            Number(calculated_emissions),
          ]
        );
      }

      await connection.commit();

      res.status(201).json({
        message:
          "Footprint report saved successfully.",

        report: {
          id: reportId,
          user_id: buyerId,
          reporting_year: year,

          scope1: scope1Value,
          scope2: scope2Value,
          scope3: scope3Value,
          total: total,

          status: "calculated",
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Footprint save error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to save footprint report.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Buyer: view own footprint reports
app.get(
  "/api/buyer/footprint-reports",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const buyerId = req.user.id;

      const [reports] = await db.query(
        `SELECT
          id,
          reporting_year,
          scope1_emissions,
          scope2_emissions,
          scope3_emissions,
          total_emissions,
          status,
          created_at,
          updated_at
         FROM footprint_reports
         WHERE user_id = ?
         ORDER BY reporting_year DESC, created_at DESC`,
        [buyerId]
      );

      res.json({
        reports: reports.map((report) => ({
          id: Number(report.id),

          reporting_year: Number(
            report.reporting_year
          ),

          scope1: Number(
            report.scope1_emissions
          ),

          scope2: Number(
            report.scope2_emissions
          ),

          scope3: Number(
            report.scope3_emissions
          ),

          total: Number(
            report.total_emissions
          ),

          status: report.status,

          created_at: report.created_at,
          updated_at: report.updated_at,
        })),
      });
    } catch (error) {
      console.error(
        "Footprint reports error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load footprint reports.",
      });
    }
  }
);

// Buyer: finalize a footprint report
app.patch(
  "/api/buyer/footprint-reports/:id/finalize",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const reportId = Number(req.params.id);
      const buyerId = req.user.id;

      if (
        !Number.isInteger(reportId) ||
        reportId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid report ID.",
        });
      }

      const [reports] = await db.query(
        `SELECT
          id,
          status
         FROM footprint_reports
         WHERE id = ?
           AND user_id = ?`,
        [reportId, buyerId]
      );

      if (reports.length === 0) {
        return res.status(404).json({
          error: "Footprint report not found.",
        });
      }

      const report = reports[0];

      if (report.status === "finalized") {
        return res.status(400).json({
          error:
            "This footprint report is already finalized.",
        });
      }

      await db.query(
        `UPDATE footprint_reports
         SET status = 'finalized'
         WHERE id = ?
           AND user_id = ?`,
        [reportId, buyerId]
      );

      res.json({
        message:
          "Footprint report finalized successfully.",

        report: {
          id: reportId,
          status: "finalized",
        },
      });
    } catch (error) {
      console.error(
        "Footprint finalization error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to finalize footprint report.",
      });
    }
  }
);
// Buyer: purchase credits from an active marketplace listing
app.post(
  "/api/marketplace/listings/:id/purchase",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const listingId = Number(req.params.id);
      const buyerId = req.user.id;

      const { quantity } = req.body;

      // Validate listing ID
      if (
        !Number.isInteger(listingId) ||
        listingId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid marketplace listing ID.",
        });
      }

      // Validate quantity
      const purchaseQuantity = Number(quantity);

      if (
        !Number.isFinite(purchaseQuantity) ||
        !Number.isInteger(purchaseQuantity) ||
        purchaseQuantity <= 0
      ) {
        return res.status(400).json({
          error:
            "Purchase quantity must be a positive whole number.",
        });
      }

      // Start transaction
      await connection.beginTransaction();

      /*
       * Lock the listing row.
       * This prevents two buyers from purchasing the same
       * remaining credits simultaneously.
       */
      const [listings] = await connection.query(
        `SELECT
          ml.id,
          ml.credit_id,
          ml.seller_id,
          ml.quantity,
          ml.remaining_quantity,
          ml.price_per_credit,
          ml.status,

          c.available_quantity,
          c.status AS credit_status,

          p.name AS project_name,
          p.status AS project_status

         FROM marketplace_listings ml

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         WHERE ml.id = ?
         FOR UPDATE`,
        [listingId]
      );

      if (listings.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          error: "Marketplace listing not found.",
        });
      }

      const listing = listings[0];

      // Listing must be active
      if (listing.status !== "active") {
        await connection.rollback();

        return res.status(400).json({
          error:
            "This marketplace listing is no longer active.",
        });
      }

      // Project must remain verified
      if (listing.project_status !== "verified") {
        await connection.rollback();

        return res.status(400).json({
          error:
            "Credits can only be purchased from verified projects.",
        });
      }

      // Seller cannot purchase their own listing
      if (Number(listing.seller_id) === buyerId) {
        await connection.rollback();

        return res.status(400).json({
          error:
            "A project owner cannot purchase their own listing.",
        });
      }

      const remainingQuantity = Number(
        listing.remaining_quantity
      );

      const availableCredits = Number(
        listing.available_quantity
      );

      // Protect against inconsistent inventory
      if (
        remainingQuantity !== availableCredits
      ) {
        await connection.rollback();

        return res.status(409).json({
          error:
            "Credit inventory is inconsistent. Purchase cannot continue.",
        });
      }

      // Check requested quantity
      if (purchaseQuantity > remainingQuantity) {
        await connection.rollback();

        return res.status(400).json({
          error:
            `Only ${remainingQuantity.toLocaleString()} credits are currently available.`,
        });
      }

      const pricePerCredit = Number(
        listing.price_per_credit
      );

      const totalAmount =
        purchaseQuantity * pricePerCredit;

      const newRemainingQuantity =
        remainingQuantity - purchaseQuantity;

      const newCreditAvailable =
        availableCredits - purchaseQuantity;

      // Determine new statuses
      const newListingStatus =
        newRemainingQuantity === 0
          ? "sold_out"
          : "active";

      const newCreditStatus =
        newCreditAvailable === 0
          ? "sold_out"
          : "partially_sold";

      // Create completed purchase record
      const [purchaseResult] = await connection.query(
  `INSERT INTO purchases
    (
      listing_id,
      buyer_id,
      quantity,
      price_per_credit,
      total_amount,
      status,
      purchased_at
    )
   VALUES (?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
  [
    listingId,
    buyerId,
    purchaseQuantity,
    pricePerCredit,
    totalAmount,
  ]
);

// Generate a user-facing Verdiq transaction reference
const transactionReference =
  `VQ-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${String(
      purchaseResult.insertId
    ).padStart(6, "0")}`;

      // Reduce marketplace inventory
      await connection.query(
        `UPDATE marketplace_listings
         SET
           remaining_quantity = ?,
           status = ?
         WHERE id = ?`,
        [
          newRemainingQuantity,
          newListingStatus,
          listingId,
        ]
      );

      // Reduce credit-batch inventory
      await connection.query(
        `UPDATE credits
         SET
           available_quantity = ?,
           status = ?
         WHERE id = ?`,
        [
          newCreditAvailable,
          newCreditStatus,
          listing.credit_id,
        ]
      );

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        message:
          "Credit purchase completed successfully.",

        purchase: {
          id: purchaseResult.insertId,
          transaction_id: transactionReference,
          listing_id: listingId,
          buyer_id: buyerId,
          project_name: listing.project_name,
          quantity: purchaseQuantity,
          price_per_credit: pricePerCredit,
          total_amount: totalAmount,
          status: "completed",
        },

        inventory: {
          listing_remaining_quantity:
            newRemainingQuantity,
          credit_available_quantity:
            newCreditAvailable,
          listing_status: newListingStatus,
          credit_status: newCreditStatus,
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Credit purchase error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to complete credit purchase.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Buyer: view one completed purchase
app.get(
  "/api/buyer/purchases/:id",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const purchaseId = Number(req.params.id);
      const buyerId = req.user.id;

      if (
        !Number.isInteger(purchaseId) ||
        purchaseId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid purchase ID.",
        });
      }

      const [purchases] = await db.query(
        `SELECT
          pu.id,
          pu.listing_id,
          pu.buyer_id,
          pu.quantity,
          pu.price_per_credit,
          pu.total_amount,
          pu.status,
          pu.purchased_at,

          ml.credit_id,
          ml.seller_id,

          c.serial_number,

          p.id AS project_id,
          p.name AS project_name,

          seller.name AS seller_name,
          seller.organization AS seller_organization,

          buyer.name AS buyer_name,
          buyer.organization AS buyer_organization

         FROM purchases pu

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         INNER JOIN users seller
           ON ml.seller_id = seller.id

         INNER JOIN users buyer
           ON pu.buyer_id = buyer.id

         WHERE pu.id = ?
           AND pu.buyer_id = ?
           AND pu.status = 'completed'`,
        [purchaseId, buyerId]
      );

      if (purchases.length === 0) {
        return res.status(404).json({
          error: "Purchase not found.",
        });
      }

      const purchase = purchases[0];

      res.json({
        purchase: {
          id: purchase.id,

          transaction_id:
            `VQ-${new Date(purchase.purchased_at)
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, "")}-${String(
              purchase.id
            ).padStart(6, "0")}`,

          listing_id: purchase.listing_id,
          buyer_id: purchase.buyer_id,

          quantity: Number(purchase.quantity),

          price_per_credit: Number(
            purchase.price_per_credit
          ),

          total_amount: Number(
            purchase.total_amount
          ),

          status: purchase.status,
          purchased_at: purchase.purchased_at,

          project_name: purchase.project_name,
          project_id: purchase.project_id,

          serial_number: purchase.serial_number,

          seller_name: purchase.seller_name,
          seller_organization:
            purchase.seller_organization,

          buyer_name: purchase.buyer_name,
          buyer_organization:
            purchase.buyer_organization,
        },
      });
    } catch (error) {
      console.error(
        "Purchase details error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load purchase details.",
      });
    }
  }
);

// Buyer: complete carbon portfolio
app.get(
  "/api/buyer/portfolio",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const buyerId = req.user.id;

      // --------------------------------------------------
      // Holdings
      // --------------------------------------------------

      const [holdingsRows] = await db.query(
        `SELECT
          pu.id AS purchase_id,
          pu.listing_id,
          ml.credit_id,

          pu.quantity AS purchased_quantity,
          pu.price_per_credit,
          pu.total_amount,
          pu.purchased_at,

          c.serial_number,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location,

          COALESCE(
            (
              SELECT SUM(r.quantity)
              FROM retirements r
              WHERE r.purchase_id = pu.id
                AND r.buyer_id = ?
            ),
            0
          ) AS retired_quantity

         FROM purchases pu

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         WHERE pu.buyer_id = ?
           AND pu.status = 'completed'

         ORDER BY pu.purchased_at DESC`,
        [buyerId, buyerId]
      );

      const holdings = holdingsRows.map((item) => {
        const purchasedQuantity = Number(
          item.purchased_quantity
        );

        const retiredQuantity = Number(
          item.retired_quantity || 0
        );

        return {
          purchase_id: Number(item.purchase_id),
          listing_id: Number(item.listing_id),
          credit_id: Number(item.credit_id),

          project_id: Number(item.project_id),
          project_name: item.project_name,
          project_type: item.project_type,
          location: item.location,

          serial_number: item.serial_number,

          purchased_quantity: purchasedQuantity,

          retired_quantity: retiredQuantity,

          owned_quantity: Math.max(
            purchasedQuantity - retiredQuantity,
            0
          ),

          price_per_credit: Number(
            item.price_per_credit
          ),

          total_amount: Number(
            item.total_amount
          ),

          purchased_at: item.purchased_at,
        };
      });

      // --------------------------------------------------
      // Purchase history
      // --------------------------------------------------

      const [purchaseRows] = await db.query(
        `SELECT
          pu.id,
          pu.listing_id,
          pu.quantity,
          pu.price_per_credit,
          pu.total_amount,
          pu.status,
          pu.purchased_at,

          ml.credit_id,

          c.serial_number,

          p.name AS project_name,

          seller.name AS seller_name,
          seller.organization AS seller_organization

         FROM purchases pu

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         INNER JOIN users seller
           ON ml.seller_id = seller.id

         WHERE pu.buyer_id = ?

         ORDER BY pu.purchased_at DESC`,
        [buyerId]
      );

      const purchases = purchaseRows.map(
        (purchase) => ({
          id: Number(purchase.id),
          listing_id: Number(
            purchase.listing_id
          ),
          credit_id: Number(
            purchase.credit_id
          ),

          project_name:
            purchase.project_name,

          serial_number:
            purchase.serial_number,

          seller: {
            name: purchase.seller_name,
            organization:
              purchase.seller_organization,
          },

          quantity: Number(
            purchase.quantity
          ),

          price_per_credit: Number(
            purchase.price_per_credit
          ),

          total_amount: Number(
            purchase.total_amount
          ),

          status: purchase.status,

          purchased_at:
            purchase.purchased_at,
        })
      );

      // --------------------------------------------------
      // Retirement history
      // --------------------------------------------------

      const [retirementRows] =
        await db.query(
          `SELECT
            r.id,
            r.purchase_id,
            r.quantity,
            r.reason,
            r.retirement_reference,
            r.retired_at,

            p.name AS project_name,

            cert.id AS certificate_id,
            cert.certificate_number,
            cert.issued_at AS certificate_issued_at

           FROM retirements r

           INNER JOIN purchases pu
             ON r.purchase_id = pu.id

           INNER JOIN marketplace_listings ml
             ON pu.listing_id = ml.id

           INNER JOIN credits c
             ON ml.credit_id = c.id

           INNER JOIN projects p
             ON c.project_id = p.id

           LEFT JOIN certificates cert
             ON cert.retirement_id = r.id

           WHERE r.buyer_id = ?

           ORDER BY r.retired_at DESC`,
          [buyerId]
        );

      const retirements =
        retirementRows.map(
          (retirement) => ({
            id: Number(retirement.id),

            purchase_id: Number(
              retirement.purchase_id
            ),

            project_name:
              retirement.project_name,

            quantity: Number(
              retirement.quantity
            ),

            reason:
              retirement.reason,

            retirement_reference:
              retirement.retirement_reference,

            retired_at:
              retirement.retired_at,

            certificate:
              retirement.certificate_id
                ? {
                    id: Number(
                      retirement.certificate_id
                    ),

                    certificate_number:
                      retirement.certificate_number,

                    issued_at:
                      retirement.certificate_issued_at,
                  }
                : null,
          })
        );

      // --------------------------------------------------
      // Summary
      // --------------------------------------------------

      const totalPurchased =
        holdings.reduce(
          (sum, holding) =>
            sum +
            holding.purchased_quantity,
          0
        );

      const totalOwned =
        holdings.reduce(
          (sum, holding) =>
            sum + holding.owned_quantity,
          0
        );

      const totalRetired =
        holdings.reduce(
          (sum, holding) =>
            sum + holding.retired_quantity,
          0
        );

      const totalPurchaseValue =
        purchases.reduce(
          (sum, purchase) =>
            sum + purchase.total_amount,
          0
        );

      res.json({
        summary: {
          total_purchased:
            totalPurchased,

          total_owned:
            totalOwned,

          total_retired:
            totalRetired,

          purchase_count:
            purchases.filter(
              (purchase) =>
                purchase.status ===
                "completed"
            ).length,

          total_purchase_value:
            totalPurchaseValue,
        },

        holdings,

        purchases,

        retirements,
      });
    } catch (error) {
      console.error(
        "Complete buyer portfolio error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load complete buyer portfolio.",
      });
    }
  }
);


// Buyer: retire purchased carbon credits
app.post(
  "/api/buyer/purchases/:id/retire",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const purchaseId = Number(req.params.id);
      const buyerId = req.user.id;

      const {
        quantity,
        reason,
      } = req.body;

      // Validate purchase ID
      if (
        !Number.isInteger(purchaseId) ||
        purchaseId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid purchase ID.",
        });
      }

      // Validate retirement quantity
      const retirementQuantity = Number(quantity);

      if (
        !Number.isFinite(retirementQuantity) ||
        !Number.isInteger(retirementQuantity) ||
        retirementQuantity <= 0
      ) {
        return res.status(400).json({
          error:
            "Retirement quantity must be a positive whole number.",
        });
      }

      // Start transaction
      await connection.beginTransaction();

      /*
       * Lock the purchase row.
       * This prevents concurrent retirement requests
       * from exceeding the buyer's available balance.
       */
      const [purchases] = await connection.query(
        `SELECT
          pu.id,
          pu.buyer_id,
          pu.quantity,
          pu.status,

          p.name AS project_name,
          c.serial_number

         FROM purchases pu

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         WHERE pu.id = ?
           AND pu.buyer_id = ?
         FOR UPDATE`,
        [purchaseId, buyerId]
      );

      if (purchases.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          error: "Purchase not found.",
        });
      }

      const purchase = purchases[0];

      // Purchase must be completed
      if (purchase.status !== "completed") {
        await connection.rollback();

        return res.status(400).json({
          error:
            "Only completed purchases can be retired.",
        });
      }

      // Calculate how many credits have already been retired
      const [retirementRows] = await connection.query(
        `SELECT
          COALESCE(SUM(quantity), 0) AS retired_quantity
         FROM retirements
         WHERE purchase_id = ?
           AND buyer_id = ?`,
        [purchaseId, buyerId]
      );

      const alreadyRetired = Number(
        retirementRows[0].retired_quantity || 0
      );

      const purchasedQuantity = Number(
        purchase.quantity
      );

      const availableToRetire =
        purchasedQuantity - alreadyRetired;

      // Protect against inconsistent data
      if (availableToRetire <= 0) {
        await connection.rollback();

        return res.status(400).json({
          error:
            "All credits from this purchase have already been retired.",
        });
      }

      // Check requested quantity
      if (retirementQuantity > availableToRetire) {
        await connection.rollback();

        return res.status(400).json({
          error:
            `You can retire only ${availableToRetire.toLocaleString()} credits from this purchase.`,
        });
      }

      // Generate unique retirement reference
      const retirementReference =
        `RET-${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}-${Date.now()
          .toString()
          .slice(-6)}`;

      // Store retirement record
      const [result] = await connection.query(
        `INSERT INTO retirements
          (
            purchase_id,
            buyer_id,
            quantity,
            reason,
            retirement_reference,
            retired_at
          )
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          purchaseId,
          buyerId,
          retirementQuantity,
          reason?.trim() || null,
          retirementReference,
        ]
      );

      
      const certificateNumber =
  `VQ-CERT-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${String(
    result.insertId
  ).padStart(6, "0")}`;

const [certificateResult] =
  await connection.query(
    `INSERT INTO certificates
      (
        retirement_id,
        certificate_number,
        issued_at
      )
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [
      result.insertId,
      certificateNumber,
    ]
  );
  await connection.commit();

      res.status(201).json({
        message:
          "Carbon credits retired successfully.",

        retirement: {
          id: result.insertId,
          purchase_id: purchaseId,
          buyer_id: buyerId,

          project_name: purchase.project_name,
          serial_number: purchase.serial_number,

          quantity: retirementQuantity,

          remaining_owned:
            availableToRetire -
            retirementQuantity,

          reason:
            reason?.trim() || null,

          retirement_reference:
            retirementReference,

          status: "completed",
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Credit retirement error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to retire carbon credits.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Buyer: view one retirement record
app.get(
  "/api/buyer/retirements/:id",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const retirementId = Number(req.params.id);
      const buyerId = req.user.id;

      if (
        !Number.isInteger(retirementId) ||
        retirementId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid retirement ID.",
        });
      }

      const [rows] = await db.query(
        `SELECT
          r.id,
          r.purchase_id,
          r.buyer_id,
          r.quantity,
          r.reason,
          r.retirement_reference,
          r.retired_at,

          c.serial_number,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location,

          cert.id AS certificate_id,
          cert.certificate_number,
          cert.issued_at AS certificate_issued_at

         FROM retirements r

         INNER JOIN purchases pu
           ON r.purchase_id = pu.id

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         LEFT JOIN certificates cert
           ON cert.retirement_id = r.id

         WHERE r.id = ?
           AND r.buyer_id = ?`,
        [retirementId, buyerId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Retirement record not found.",
        });
      }

      const retirement = rows[0];

      res.json({
        retirement: {
          id: retirement.id,
          purchase_id: retirement.purchase_id,
          buyer_id: retirement.buyer_id,

          quantity: Number(
            retirement.quantity
          ),

          reason: retirement.reason,

          retirement_reference:
            retirement.retirement_reference,

          retired_at: retirement.retired_at,

          project_id: retirement.project_id,
          project_name: retirement.project_name,
          project_type: retirement.project_type,
          location: retirement.location,

          serial_number:
            retirement.serial_number,

          certificate: retirement.certificate_id
            ? {
                id: retirement.certificate_id,
                certificate_number:
                  retirement.certificate_number,
                issued_at:
                  retirement.certificate_issued_at,
              }
            : null,
        },
      });
    } catch (error) {
      console.error(
        "Retirement details error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load retirement details.",
      });
    }
  }
);

// Buyer: view one retirement certificate
app.get(
  "/api/buyer/certificates/:id",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const certificateId = Number(req.params.id);
      const buyerId = req.user.id;

      if (
        !Number.isInteger(certificateId) ||
        certificateId <= 0
      ) {
        return res.status(400).json({
          error: "Invalid certificate ID.",
        });
      }

      const [rows] = await db.query(
        `SELECT
          cert.id AS certificate_id,
          cert.certificate_number,
          cert.issued_at AS certificate_issued_at,

          r.id AS retirement_id,
          r.purchase_id,
          r.buyer_id,
          r.quantity AS retired_quantity,
          r.reason,
          r.retirement_reference,
          r.retired_at,

          pu.quantity AS purchased_quantity,
          pu.price_per_credit,
          pu.total_amount,
          pu.purchased_at,

          ml.id AS listing_id,

          c.id AS credit_id,
          c.serial_number,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location,
          p.description,

          buyer.name AS buyer_name,
          buyer.organization AS buyer_organization

         FROM certificates cert

         INNER JOIN retirements r
           ON cert.retirement_id = r.id

         INNER JOIN purchases pu
           ON r.purchase_id = pu.id

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         INNER JOIN users buyer
           ON r.buyer_id = buyer.id

         WHERE cert.id = ?
           AND r.buyer_id = ?`,
        [certificateId, buyerId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Certificate not found.",
        });
      }

      const certificate = rows[0];

      res.json({
        certificate: {
          id: certificate.certificate_id,
          certificate_number:
            certificate.certificate_number,

          issued_at:
            certificate.certificate_issued_at,

          retirement: {
            id: certificate.retirement_id,
            purchase_id:
              certificate.purchase_id,

            quantity: Number(
              certificate.retired_quantity
            ),

            reason: certificate.reason,

            retirement_reference:
              certificate.retirement_reference,

            retired_at:
              certificate.retired_at,
          },

          purchase: {
            quantity: Number(
              certificate.purchased_quantity
            ),

            price_per_credit: Number(
              certificate.price_per_credit
            ),

            total_amount: Number(
              certificate.total_amount
            ),

            purchased_at:
              certificate.purchased_at,
          },

          buyer: {
            name: certificate.buyer_name,
            organization:
              certificate.buyer_organization,
          },

          project: {
            id: certificate.project_id,
            name: certificate.project_name,
            project_type:
              certificate.project_type,
            location: certificate.location,
            description:
              certificate.description,
          },

          credit: {
            id: certificate.credit_id,
            serial_number:
              certificate.serial_number,
          },
        },
      });
    } catch (error) {
      console.error(
        "Certificate details error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load certificate details.",
      });
    }
  }
);

// Auditor: view projects awaiting verification
app.get(
  "/api/auditor/projects",
  authenticateToken,
  requireRole("auditor"),
  async (req, res) => {
    try {
      const [projects] = await db.query(
        `SELECT
          p.id,
          p.name,
          p.project_type,
          p.location,
          p.description,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status,
          p.submitted_at,
          u.name AS developer_name,
          u.organization
        FROM projects p
        INNER JOIN users u
          ON p.developer_id = u.id
        WHERE p.status = 'under_review'
        ORDER BY p.submitted_at ASC`
      );

      res.json({
        projects,
      });
    } catch (error) {
      console.error(
        "Error fetching auditor projects:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch projects for review.",
      });
    }
  }
);

// Auditor: view a specific project for review
app.get(
  "/api/auditor/projects/:id",
  authenticateToken,
  requireRole("auditor"),
  async (req, res) => {
    try {
      const projectId = Number(req.params.id);

      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      const [projects] = await db.query(
        `SELECT
          p.id,
          p.name,
          p.project_type,
          p.location,
          p.description,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status,
          p.submitted_at,
          p.created_at,
          u.id AS developer_id,
          u.name AS developer_name,
          u.organization AS developer_organization,
          u.email AS developer_email
        FROM projects p
        INNER JOIN users u
          ON p.developer_id = u.id
        WHERE p.id = ?`,
        [projectId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = projects[0];

      // Get documents associated with this project
      const [documents] = await db.query(
        `SELECT
          id,
          document_name,
          document_type,
          file_url,
          uploaded_at
        FROM project_documents
        WHERE project_id = ?
        ORDER BY uploaded_at DESC`,
        [projectId]
      );

      // Get previous audits, if any
      const [audits] = await db.query(
        `SELECT
          a.id,
          a.status,
          a.findings,
          a.audited_at,
          u.name AS auditor_name
        FROM audits a
        INNER JOIN users u
          ON a.auditor_id = u.id
        WHERE a.project_id = ?
        ORDER BY a.created_at DESC`,
        [projectId]
      );

      res.json({
        project: {
          id: project.id,
          name: project.name,
          project_type: project.project_type,
          location: project.location,
          description: project.description,
          expected_credits: Number(project.expected_credits),
          approved_issuance_quantity:
          project.approved_issuance_quantity !== null
          ? Number(project.approved_issuance_quantity)
          : null,

          status: project.status,
          submitted_at: project.submitted_at,
          created_at: project.created_at,
          developer: {
            id: project.developer_id,
            name: project.developer_name,
            organization: project.developer_organization,
            email: project.developer_email,
          },
          documents,
          audits,
        },
      });
    } catch (error) {
      console.error(
        "Error fetching project review:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch project review details.",
      });
    }
  }
);

// Auditor: approve or reject a project
app.patch(
  "/api/auditor/projects/:id/review",
  authenticateToken,
  requireRole("auditor"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const projectId = Number(req.params.id);
      const auditorId = req.user.id;

      const {
        decision,
        findings,
        approved_issuance_quantity,
      } = req.body;

      // Validate project ID
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      // Validate decision
      if (!["approved", "rejected"].includes(decision)) {
        return res.status(400).json({
          error:
            "Decision must be either approved or rejected.",
        });
      }

      // Findings are required
      if (!findings || !findings.trim()) {
        return res.status(400).json({
          error: "Audit findings are required.",
        });
      }

      // Get project
      const [projects] = await connection.query(
        `SELECT
          id,
          status,
          expected_credits,
          approved_issuance_quantity
         FROM projects
         WHERE id = ?`,
        [projectId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = projects[0];

      // Project must currently be awaiting review
      if (project.status !== "under_review") {
        return res.status(400).json({
          error:
            "Only projects under review can be audited.",
        });
      }

      // Only approval requires an issuance quantity
      let approvedQuantity = null;

      if (decision === "approved") {
        approvedQuantity = Number(
          approved_issuance_quantity
        );

        // Whole-number quantity only
        if (
          !Number.isFinite(approvedQuantity) ||
          !Number.isInteger(approvedQuantity) ||
          approvedQuantity <= 0
        ) {
          return res.status(400).json({
            error:
              "Approved issuance quantity must be a positive whole number.",
          });
        }

        // Cannot approve more than developer's expected amount
        if (
          approvedQuantity >
          Number(project.expected_credits)
        ) {
          return res.status(400).json({
            error:
              "Approved issuance quantity cannot exceed the project's expected credits.",
          });
        }
      }

      const projectStatus =
        decision === "approved"
          ? "verified"
          : "rejected";

      // Start transaction
      await connection.beginTransaction();

      // Record auditor decision
      await connection.query(
        `INSERT INTO audits
          (
            project_id,
            auditor_id,
            status,
            findings,
            audited_at
          )
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          projectId,
          auditorId,
          decision,
          findings.trim(),
        ]
      );

      // Update project status and approved issuance
      await connection.query(
        `UPDATE projects
         SET
           status = ?,
           approved_issuance_quantity = ?
         WHERE id = ?`,
        [
          projectStatus,
          approvedQuantity,
          projectId,
        ]
      );

      // Commit both operations
      await connection.commit();

      res.json({
        message:
          decision === "approved"
            ? "Project approved successfully."
            : "Project rejected successfully.",

        project: {
          id: projectId,
          status: projectStatus,
          approved_issuance_quantity:
            approvedQuantity,
        },

        audit: {
          auditor_id: auditorId,
          status: decision,
          findings: findings.trim(),
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Project review error:",
        error.message
      );

      res.status(500).json({
        error: "Failed to submit project review.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Admin: issue carbon credits for a verified project
app.post(
  "/api/admin/projects/:id/issue-credits",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    let connection;

    try {
      connection = await db.getConnection();

      const projectId = Number(req.params.id);

      // Validate project ID
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          error: "Invalid project ID.",
        });
      }

      // Get verified project and auditor-approved quantity
      const [projects] = await connection.query(
        `SELECT
          id,
          name,
          expected_credits,
          approved_issuance_quantity,
          status
         FROM projects
         WHERE id = ?`,
        [projectId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = projects[0];

      // Project must be verified
      if (project.status !== "verified") {
        return res.status(400).json({
          error:
            "Credits can only be issued for verified projects.",
        });
      }

      // Auditor must have approved an issuance quantity
      const approvedQuantity = Number(
        project.approved_issuance_quantity
      );

      if (
        !Number.isFinite(approvedQuantity) ||
        !Number.isInteger(approvedQuantity) ||
        approvedQuantity <= 0
      ) {
        return res.status(400).json({
          error:
            "This project does not have a valid auditor-approved issuance quantity.",
        });
      }

      // Prevent duplicate issuance
      const [existingCredits] = await connection.query(
        `SELECT id
         FROM credits
         WHERE project_id = ?
         LIMIT 1`,
        [projectId]
      );

      if (existingCredits.length > 0) {
        return res.status(409).json({
          error:
            "Credits have already been issued for this project.",
        });
      }

      // Generate unique credit batch serial
      const serialNumber =
        `VERDIQ-${projectId}-${Date.now()}-${Math.floor(
          Math.random() * 100000
        )}`;

      // Start transaction
      await connection.beginTransaction();

      // Create credit batch
      const [result] = await connection.query(
        `INSERT INTO credits
          (
            project_id,
            serial_number,
            quantity,
            available_quantity,
            retired_quantity,
            price_per_credit,
            status
          )
         VALUES (?, ?, ?, ?, 0, 0, 'issued')`,
        [
          projectId,
          serialNumber,
          approvedQuantity,
          approvedQuantity,
        ]
      );

      // Commit
      await connection.commit();

      res.status(201).json({
        message:
          "Carbon credits issued successfully.",

        credit: {
          id: result.insertId,
          project_id: projectId,
          project_name: project.name,
          serial_number: serialNumber,

          quantity: approvedQuantity,
          available_quantity: approvedQuantity,
          retired_quantity: 0,

          // Pricing is set later by the project owner
          price_per_credit: 0,

          status: "issued",
        },
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "Rollback error:",
            rollbackError.message
          );
        }
      }

      console.error(
        "Credit issuance error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to issue carbon credits.",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Buyer: view completed purchases
app.get(
  "/api/buyer/purchases",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    try {
      const buyerId = req.user.id;

      const [purchases] = await db.query(
        `SELECT
          pu.id,
          pu.listing_id,
          pu.quantity,
          pu.price_per_credit,
          pu.total_amount,
          pu.status,
          pu.purchased_at,

          ml.credit_id,

          c.serial_number,

          p.id AS project_id,
          p.name AS project_name,
          p.project_type,
          p.location

         FROM purchases pu

         INNER JOIN marketplace_listings ml
           ON pu.listing_id = ml.id

         INNER JOIN credits c
           ON ml.credit_id = c.id

         INNER JOIN projects p
           ON c.project_id = p.id

         WHERE pu.buyer_id = ?
           AND pu.status = 'completed'

         ORDER BY pu.purchased_at DESC`,
        [buyerId]
      );

      res.json({
        purchases,
      });
    } catch (error) {
      console.error(
        "Buyer purchases error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to load buyer purchases.",
      });
    }
  }
);

// Admin: view verified projects and their credit issuance status
app.get(
  "/api/admin/projects/verified",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [projects] = await db.query(
        `SELECT
          p.id,
          p.name,
          p.project_type,
          p.location,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status,
          COALESCE(SUM(c.quantity), 0) AS issued_credits,
          COALESCE(SUM(c.available_quantity), 0) AS available_credits
        FROM projects p
        LEFT JOIN credits c
          ON p.id = c.project_id
        WHERE p.status = 'verified'
        GROUP BY
          p.id,
          p.name,
          p.project_type,
          p.location,
          p.expected_credits,
          p.approved_issuance_quantity,
          p.status
        ORDER BY p.id DESC`
      );

      res.json({
        projects,
      });
    } catch (error) {
      console.error(
        "Error fetching verified projects:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch verified projects.",
      });
    }
  }
);



// Admin statistics
app.get("/api/admin/stats", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const [userRows] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [projectRows] = await db.query(
      "SELECT COUNT(*) AS total_projects FROM projects"
    );

    const [creditRows] = await db.query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_credits FROM credits"
    );

    const [retirementRows] = await db.query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_retired FROM retirements"
    );

    res.json({
      total_users: userRows[0].total_users,
      total_projects: projectRows[0].total_projects,
      total_credits: creditRows[0].total_credits,
      total_retired: retirementRows[0].total_retired,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error.message);

    res.status(500).json({
      error: "Failed to fetch admin statistics",
    });
  }
});

// Public: latest atmospheric CO2 observation from NOAA GML
app.get(
  "/api/public/climate",
  async (req, res) => {
    try {
      const NOAA_URL =
        "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv";

      const response = await fetch(NOAA_URL);

      if (!response.ok) {
        throw new Error(
          `NOAA returned HTTP ${response.status}`
        );
      }

      const csv = await response.text();

      const lines = csv
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(
          (line) =>
            line &&
            !line.startsWith("#")
        );

      if (lines.length < 2) {
        throw new Error(
          "NOAA CO2 dataset returned no observations."
        );
      }

      const header = lines[0]
        .split(",")
        .map((item) =>
          item.trim().toLowerCase()
        );

      const yearIndex = header.indexOf("year");
      const monthIndex = header.indexOf("month");
      const averageIndex = header.indexOf("average");

      if (
        yearIndex === -1 ||
        monthIndex === -1 ||
        averageIndex === -1
      ) {
        throw new Error(
          "Unexpected NOAA CSV format."
        );
      }

      const observations = [];

      for (const line of lines.slice(1)) {
        const columns = line.split(",");

        const year = Number(
          columns[yearIndex]
        );

        const month = Number(
          columns[monthIndex]
        );

        const average = Number(
          columns[averageIndex]
        );

        if (
          Number.isInteger(year) &&
          Number.isInteger(month) &&
          month >= 1 &&
          month <= 12 &&
          Number.isFinite(average) &&
          average > 0
        ) {
          observations.push({
            year,
            month,
            average,
          });
        }
      }

      if (observations.length === 0) {
        throw new Error(
          "No valid NOAA CO2 observations found."
        );
      }

      observations.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }

        return a.month - b.month;
      });

      const latest =
        observations[
          observations.length - 1
        ];

      res.json({
        atmospheric_co2_ppm:
          latest.average,

        observation_year:
          latest.year,

        observation_month:
          latest.month,

        source: "NOAA Global Monitoring Laboratory",

        source_url:
          "https://gml.noaa.gov/ccgg/trends/",

        dataset:
          "Mauna Loa Monthly Mean CO2",
      });
    } catch (error) {
      console.error(
        "NOAA climate data error:",
        error.message
      );

      res.status(503).json({
        error:
          "Atmospheric CO2 data is temporarily unavailable.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Verdiq backend running on http://localhost:${PORT}`);
});