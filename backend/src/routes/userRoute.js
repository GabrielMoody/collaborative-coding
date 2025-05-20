const router = require("express").Router();

const { findUserByNameController } = require("../controller/userController");

router.get("/search", findUserByNameController);

module.exports = router;