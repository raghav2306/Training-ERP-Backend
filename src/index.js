import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 5432, // Database port (default is 5432)
    dialect: "postgres",
    logging: false,
  }
);

// Define the Student Model
const Student = sequelize.define(
  "student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "student", // Ensure this matches the table name in your database
    timestamps: false, // Disable createdAt and updatedAt if not needed
  }
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express & Sequelize app!" });
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll(); // Fetch all students from the table
    res.json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
});

// Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
