const express = require("express");
const Auth = require("../../middleware/auth");

const { getById, getAll, add, update, remove } = require("./bill");

const router = express.Router();

router.post("/add", add); // Anyone can place the order
router.get("/getById/:id", Auth.authorizeUser,getById);
router.get("/getAll", Auth.authorizeAdmin, getAll);
router.put("/update/:id", Auth.authorizeAdmin, update);
router.delete("/remove/:id", Auth.authorizeAdmin, remove);

module.exports = router;
