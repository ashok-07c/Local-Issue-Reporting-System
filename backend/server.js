require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Core middleware
// CORS_ORIGIN accepts a single origin or a comma-separated list
// (e.g. "https://myapp.vercel.app,https://www.myapp.com").
// Falls back to allowing all origins when unset (local dev).
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded complaint photos as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check — useful to quickly confirm the server is up
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Local Issue Reporter API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// In production, optionally serve the built React app from this same
// service (useful on single-service hosts like Render/Railway).
// Skip this entirely if you deploy the frontend separately (e.g. Vercel/Netlify).
if (process.env.SERVE_FRONTEND === "true") {
  const frontendDist = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDist));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Local Issue Reporter backend running on http://localhost:${PORT}`);
});
