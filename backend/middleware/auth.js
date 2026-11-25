const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

    if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
