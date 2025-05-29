const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const { generateTokenAndSetCookie } = require('../lib/utils/generateToken.js');

const signup = async(req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        if(!username || !fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(400).json({ message: "username is already taken" });
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            fullName,
            email,
            password: hashedPassword,
        });
        
        res.status(201).json(newUser);

    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            }
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMe = async(req, res) => {
    try {
        const myId = req.user._id;
        const user = await User.findById(myId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    login,
    signup,
    logout,
    getMe,
}