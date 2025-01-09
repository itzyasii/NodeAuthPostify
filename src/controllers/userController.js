const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: `User with this email: ${email} already exists.`,
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });
    let result = await newUser.save();
    res.status(201).json({ message: "Registrations successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error " + err.message });
  }
};

exports.signIn = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    if (email === undefined || password === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expiresIn: new Date(Date.now() + 8 * 3600000),
      })
      .json({ success: true, token, message: "Login successful." });
    // res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
exports.SignOut = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: `Successfully signed out` });
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (existingUser.verified) {
      return res.status(400).json({
        success: false,
        message: "You are already verified",
      });
    }
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transport.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification Code",
      html: `<h1>Your verification code is ${codeValue} </h1> `, 
    })

    if(info.accepted[0] === existingUser.email) {
      res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
      });
    }

    existingUser.verificationToken = parseInt(codeValue);
    await existingUser.save(); 
  
  } catch (error) {}
};
