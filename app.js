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

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
