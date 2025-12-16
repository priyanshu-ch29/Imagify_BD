const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = connectDb