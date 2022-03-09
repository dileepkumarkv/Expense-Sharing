const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");
const groupController = require("../controllers/group.controller");
const expenseController = require("../controllers/expense.controller");

router.post("/user", userController.createUser);

router.post("/group", groupController.createGroup);

router.post("/expense", expenseController.createExpense);
router.get("/expense/:id", expenseController.getExpense);

module.exports = router;
