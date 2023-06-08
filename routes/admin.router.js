const AdminController = require("../controllers/adminController");

const router = require("express").Router();

router.get("/admin", AdminController.getAdminPage);

module.exports = router;
