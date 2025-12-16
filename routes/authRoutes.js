const express = require("express");
const { RegisterUser, Login, logout, sendOTP, verifyOtp, resetPassword } = require("../controller/authController");
const { passwordToken } = require("../middleware/passwordToken");
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", Login)
router.post("/logout", logout)
router.post("/send-otp", sendOTP);
router.post("/verify-otp", passwordToken, verifyOtp)
router.post("/reset-password", passwordToken, resetPassword)


module.exports = router