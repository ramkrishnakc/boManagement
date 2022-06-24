const express = require("express");
const User = require("./user");
const Auth = require("../../middleware/auth");

const router = express.Router();

router.post("/login", User.login);
router.post("/signup", User.signup);
router.get("/verify-email", User.verifyEmail);
router.get("/getById/:id", Auth.authorizeToken, User.getById);
router.get("/getAll", Auth.authorizeAdmin, User.getAll);
router.post("/add", Auth.authorizeAdmin, User.add);
router.delete("/remove/:id", Auth.authorizeAdmin, User.remove);
router.put("/update/:id", Auth.authorizeToken, User.update);
router.put("/pwdUpdate/:id", Auth.authorizeToken, User.pwdUpdate);

module.exports = router;
module.exports.createDefaultUser = User.createDefaultUser;
