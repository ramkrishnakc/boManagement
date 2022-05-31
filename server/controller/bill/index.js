const express = require("express");
const Auth = require("../../middleware/auth");

const { getById, getAll, add, update, remove } = require("./bill");

const router = express.Router();

router.get("/getById/:id", getById);
router.get("/getAll", Auth.authorizeAdmin, getAll);
router.post("/add", Auth.authorizeAdmin, add);
router.put("/update/:id", Auth.authorizeAdmin, update);
router.delete("/remove/:id", Auth.authorizeAdmin, remove);

module.exports = router;
