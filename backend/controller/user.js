const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password is required", message: "Email and password is required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashPwd
        });
        const token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY);
        return res.status(200).json({ token, user: { _id: newUser._id, email: newUser.email } });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Sign up failed" });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password is required", message: "Email and password is required" });
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);
            return res.status(200).json({ token, user: { _id: user._id, email: user.email } });
        }
        return res.status(400).json({ error: "Invalid credentials" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Login failed" });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", email: "Unknown" });
        }
        return res.json({ email: user.email });
    } catch (err) {
        return res.status(400).json({ message: "Invalid user ID", email: "Unknown" });
    }
};

module.exports = { userLogin, userSignUp, getUser };
