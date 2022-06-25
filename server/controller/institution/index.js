const express = require("express");
const Auth = require("../../middleware/auth");
const Upload = require("../../middleware/upload");

const institution = require("./institution");
const about = require("./about");
const activity = require("./activity");
const contact = require("./contact");
const department = require("./department");
const notice = require("./notice");
const team = require("./team");

const router = express.Router();

router.get("/getById/:id", institution.getById);
router.get("/getAll", institution.getAll);

/* -------------------- Allowed Only for Admins ------------------------------------- */
router.post("/add", Auth.authorizeAdmin, Upload.single("file"), institution.add);
router.put("/update/:id", Auth.authorizeAdmin, Upload.single("file"), institution.update);
router.delete("/remove/:id", Auth.authorizeAdmin, institution.remove);

/* -------------------- Allowed Only for "Intitution" Users --------------------------- */
router.get("/getByRefId-about/:refId", Auth.authorizeInstitution, about.getByRefId);
router.post("/add-about/:refId", Auth.authorizeInstitution, Upload.single("file"), about.add);
router.put("/update-about/:refId/:id", Auth.authorizeInstitution, Upload.single("file"), about.update);

router.get("/getByRefId-activity/:refId", Auth.authorizeInstitution, activity.getByRefId);
router.post("/add-activity/:refId", Auth.authorizeInstitution, activity.add);
router.put("/update-activity/:refId/:id", Auth.authorizeInstitution, activity.update);
router.put("/remove-activity/:refId/:id", Auth.authorizeInstitution, activity.remove);

router.get("/getByRefId-contact/:refId", Auth.authorizeInstitution, contact.getByRefId);
router.post("/add-contact/:refId", Auth.authorizeInstitution, contact.add);
router.put("/update-contact/:refId/:id", Auth.authorizeInstitution, contact.update);

router.get("/getByRefId-department/:refId", Auth.authorizeInstitution, department.getByRefId);
router.post("/add-department/:refId", Auth.authorizeInstitution, department.add);
router.put("/update-department/:refId/:id", Auth.authorizeInstitution, department.update);
router.put("/remove-department/:refId/:id", Auth.authorizeInstitution, department.remove);

router.get("/getByRefId-notice/:refId", Auth.authorizeInstitution, notice.getByRefId);
router.post("/add-notice/:refId", Auth.authorizeInstitution, notice.add);
router.put("/update-notice/:refId/:id", Auth.authorizeInstitution, notice.update);
router.put("/remove-notice/:refId/:id", Auth.authorizeInstitution, notice.remove);

router.get("/getByRefId-team/:refId", Auth.authorizeInstitution, team.getByRefId);
router.post("/add-team/:refId", Auth.authorizeInstitution, team.add);
router.put("/update-team/:refId/:id", Auth.authorizeInstitution, team.update);
router.put("/remove-team/:refId/:id", Auth.authorizeInstitution, team.remove);

module.exports = router;
