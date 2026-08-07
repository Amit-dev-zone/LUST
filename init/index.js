const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await main();
        console.log("Connected to MongoDB for DB initialization");

        await Listing.deleteMany({});
        
        // Add default owner to sample listings
        const updatedData = initData.data.map((obj) => ({
            ...obj,
            owner: "6582c6442c74e82582284920"
        }));

        await Listing.insertMany(updatedData);
        console.log("Data was initialized successfully");
    } catch (err) {
        console.error("Error initializing DB:", err);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

initDB();