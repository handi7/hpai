const express = require("express");
const { userController } = require("../controllers");
const { authToken, isAdmin } = require("../helper/jwt");

const routers = express.Router();

routers.get("/users", authToken, userController.getUsers);
routers.get("/users/:id", authToken, userController.getUserById);
routers.post("/users", authToken, userController.createUser);
routers.delete("/users/:id", authToken, isAdmin, userController.deleteUserById);

module.exports = routers;
