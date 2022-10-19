const jwt = require("jsonwebtoken");
require("dotenv/config");

const jwtSecret = process.env.JWT_SECRET;

const isAuth = (req, res, next) => {
  try {
    const token = req.headers["authorization"] || req.headers["x-access-token"];
    if (!token) return res.status(401).json("No token provided...");
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        let error = new Error("Invalid token");
        error.statusCode = 401;
        throw error;
      }
      req.memberId = decoded.memberId;
      next();
    });
  } catch (err) {
    let error = new Error("Invalid token");
    error.statusCode = 401;
    return res.status(401).json(error);
  }
};

module.exports = isAuth;
