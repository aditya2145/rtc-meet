const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const { generateTokenAndSetCookie } = require('../lib/utils/generateToken.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { ApiError } = require('../utils/ApiError.js');

const signup = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json(new ApiError(400, "Username is already taken"));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json(new ApiError(400, "Email is already taken"));
    }

    if (password.length < 6) {
        return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        fullName,
        email,
        password: hashedPassword,
    });

    res.status(201).json(new ApiResponse(
        201,
        newUser,
        "Account created successfully",
    ));
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPasswordCorrect) {
        return res.status(400).json(new ApiError(400, "Invalid username or password"));
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json(new ApiResponse(
        200,
        null,
        "Logged in successfully",
    ));
});

const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json(new ApiResponse(
        200,
        null,
        "Logged out successfully",
    ));
});

const getMe = asyncHandler(async (req, res) => {
    const myId = req.user._id;
    const user = await User.findById(myId).select("-password");
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    res.status(200).json(new ApiResponse(
        200,
        user,
        "User details fetched successfully",
    ));
});

module.exports = {
    login,
    signup,
    logout,
    getMe,
}