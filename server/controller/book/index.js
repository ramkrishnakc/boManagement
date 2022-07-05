const express = require("express");
const Auth = require("../../middleware/auth");
const Upload = require("../../middleware/upload");
const DbUpload = require("../../middleware/dbUpload");

const book = require("./book");
const resource = require("./bookResource");

const router = express.Router();

router.get("/getById/:id", book.getById);
router.get("/getAll", book.getAll);
router.post("/search", book.search);
router.post("/add", Auth.authorizeAdmin, Upload.single("file"), book.add);
router.put("/update/:id", Auth.authorizeAdmin, Upload.single("file"), book.update);
router.delete("/remove/:id", Auth.authorizeAdmin, book.remove);

/* -------- For the writers --------------- */
router.get("/getPublishedBooks/:userId", Auth.authorizeWriter, book.getPublishedBooks);
router.post("/publishBook/:userId", Auth.authorizeWriter, Upload.single("file"), book.publishBook);
router.put("/updatePublishedBook/:userId/:id", Auth.authorizeWriter, Upload.single("file"), book.updatePublishedBook);
router.delete("/removePublishedBook/:userId/:id", Auth.authorizeWriter, book.removePublishedBook);

/* -------- CRUD for Book resources ----------- */
router.get("/getPdf/:refId", resource.getPdf);
router.post("/uploadPdf/:refId", Auth.authorizeAdmin, DbUpload.single("pdf"), resource.uploadPdf);
router.post("/publishPdf/:userId/:refId", Auth.authorizeWriter, DbUpload.single("pdf"), resource.publishPdf);

module.exports = router;
