const express = require("express");
const { authController } = require("../controllers");
const { authToken } = require("../helper/jwt");

const routers = express.Router();

routers.use("/login", authController.login);
routers.use("/keep-login", authToken, authController.keepLogin);

module.exports = routers;
