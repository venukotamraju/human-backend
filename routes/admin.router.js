const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.post("/", adminController.create);
router.get("/login", adminController.getLoginSession);
router.post("/login", adminController.createLoginSession);
router.post("/logout", adminController.deleteLoginSession);

module.exports = router;
