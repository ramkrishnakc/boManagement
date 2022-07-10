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

/* Institution users */
router.get("/get-inst-users/:refId", Auth.authorizeInstitution, User.getInstUsers);
router.post("/add-inst-user/:refId", Auth.authorizeInstitution, User.addInstUser);
router.delete("/remove-inst-user/:refId/:id", Auth.authorizeInstitution, User.removeInstUser);

/* Get purchased items */
router.get("/getMyPurchase/:userId", Auth.authorizeUser, User.getMyPurchase);

module.exports = router;
module.exports.createDefaultUser = User.createDefaultUser;
