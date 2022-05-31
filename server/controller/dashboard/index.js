const express = require("express");
const Auth = require("../../middleware/auth");

const { getData } = require("./dashboard");

const router = express.Router();

router.get("/getData", Auth.authorizeAdmin, getData);

module.exports = router;
