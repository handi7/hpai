const express = require("express");
const bearerToken = require("express-bearer-token");
const cors = require("cors");
const { userRouter, authRouter } = require("./routers");

require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(bearerToken());

app.use("/api", [userRouter, authRouter]);

app.listen(process.env.API_PORT, () => console.log("Api is running up..."));
