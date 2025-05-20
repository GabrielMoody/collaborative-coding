const router = require("express").Router();
const {createUserController, userLoginController} = require('../controller/authController');
const {createUserValidator} = require('../validator/authValidator');

router.post("/register", createUserValidator, createUserController);
router.post("/login", userLoginController);

module.exports = router;