const express = require("express");
const {
  signIn,
  signUp,
  SignOut,
  sendVerificationCode,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/signout", SignOut);
router.patch("/send-verfication-code", sendVerificationCode);

module.exports = router;
