const mongoose = require("mongoose");

let lastDbError = null;

const connectDB = async () => {
    const uri = process.env.CONNECTION;
    if (!uri) {
        lastDbError = "Missing CONNECTION environment variable";
        console.error("Database connection error:", lastDbError);
        return;
    }
    try {
        await mongoose.connect(uri);
        lastDbError = null;
        console.log("Database Connected...");
    } catch (err) {
        lastDbError = err.message;
        console.error("Database connection error:", err.message);
    }
};

const getDbStatus = () => ({
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    error: lastDbError
});

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
