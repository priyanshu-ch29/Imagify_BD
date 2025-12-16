const express = require("express");
const { getPlan } = require("../controller/userController");
const { authValidation } = require("../middleware/authValidtion");
const router = express.Router();

router.post("/plans", authValidation, getPlan);


module.exports = router