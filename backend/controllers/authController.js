const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route  POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists!" });
    }

    const user = await User.create({ fullName, email, password, phoneNumber });

    res.status(201).json({
      message: "Account registered successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password! Please try again." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        district: user.district || null,
        mandal: user.mandal || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
