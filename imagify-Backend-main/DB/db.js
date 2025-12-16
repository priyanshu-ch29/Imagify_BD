const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://priyanshuchaudhary1000:w3fxI1SlMnoxZuJ3@cluster0.cjvgh.mongodb.net/imagifyDB`);
        console.log("Database connected successfully");
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = connectDb