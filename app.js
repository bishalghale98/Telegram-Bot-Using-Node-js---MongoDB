const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./utils/logger");
const BotController = require("./controllers/botController");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Connect to MongoDB and start the server
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    logger.info("Connected to MongoDB");
    // Start the Telegram bot
    new BotController();

    // Start the Express server
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
