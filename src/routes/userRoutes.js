const express = require("express");
const { signIn, signUp, SignOut } = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/signout", SignOut);


module.exports = router;
