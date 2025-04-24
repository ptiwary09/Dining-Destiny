const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB();
  })
  .catch((err) => {
    console.error("Error connecting to DB or initializing data:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    const updatedData = initData.data.map((obj) => ({
      ...obj,
      owner: "667a6bb072f9726e735e1c68",
    }));
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close();  // Close the connection after initialization
  }
}
