const express = require("express");
const router = express.Router();
const userControllers = require("./userController");

router.post("/register", userControllers.registerUser);
router.get("/users", userControllers.getAllUsers);
router.get("/users/:id", userControllers.getUserById);
router.get("/transactions", userControllers.getTransactions);
router.post("/balance", userControllers.addBalance);
router.post("/transfer", userControllers.transferBalance);
router.post("/login", userControllers.loginUser);

module.exports = router;
