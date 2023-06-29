const express = require("express");
const router = express.Router();
const userControllers = require("./userController");

const setNoCacheHeader = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

router.post("/register", setNoCacheHeader, userControllers.registerUser);
router.get("/users", setNoCacheHeader, userControllers.getAllUsers);
router.get("/users/:id", setNoCacheHeader, userControllers.getUserById);
router.get("/transactions", setNoCacheHeader, userControllers.getTransactions);
router.post("/balance", setNoCacheHeader, userControllers.addBalance);
router.post("/transfer", setNoCacheHeader, userControllers.transferBalance);
router.post("/login", setNoCacheHeader, userControllers.loginUser);

module.exports = router;
