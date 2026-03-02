require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log(error);
  }
}
dbConnection();

// Require Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Endpoints
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

// Run Server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
