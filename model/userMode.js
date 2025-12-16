const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    plans: {
        type: String
    },
    credits: {
        type: Number
    },
    profile: {
        type: String,
        default: "https://cdn.vectorstock.com/i/500p/06/98/account-avatar-icon-in-line-design-vector-54270698.jpg"
    },
    otp: {
        type: Number
    },
    otpExpires: {
        type: Date
    }
})

const User = new mongoose.model("User", userSchema);
module.exports = User