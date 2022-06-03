const express = require("express");

const { getData } = require("./home");

const router = express.Router();

router.get("/getData", getData);

module.exports = router;
