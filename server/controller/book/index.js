const express = require("express");
const Auth = require("../../middleware/auth");
const Upload = require("../../middleware/upload");

const { getById, getAll, add, update, remove } = require("./book");

const router = express.Router();

router.get("/getById/:id", getById);
router.get("/getAll", getAll);
router.post("/add", Auth.authorizeAdmin, Upload.single("file"), add);
router.put("/update/:id", Auth.authorizeAdmin, Upload.single("file"), update);
router.delete("/remove/:id", Auth.authorizeAdmin, remove);

module.exports = router;
