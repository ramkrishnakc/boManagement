const express = require("express");
const Auth = require("../../middleware/auth");

const { getByUserId, getAll, add, remove } = require("./bill");

const router = express.Router();

router.get("/getByUserId/:userId", Auth.authorizeUser, getByUserId);
router.get("/getAll", Auth.authorizeAdmin, getAll);
router.post("/add", Auth.authorizeUser, add);
router.delete("/remove/:id", Auth.authorizeAdmin, remove);

module.exports = router;
