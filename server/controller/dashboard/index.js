const express = require("express");
const Auth = require("../../middleware/auth");

const { getData, getWriterDashboard } = require("./dashboard");

const router = express.Router();

router.get("/getData", Auth.authorizeAdmin, getData);
router.get("/getWriterDashboard/:userId", Auth.authorizeWriter, getWriterDashboard);

module.exports = router;
