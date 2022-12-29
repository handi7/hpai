const jwt = require("jsonwebtoken");
const db = require("../config/db");

require("dotenv").config();

module.exports = {
  createToken: (data, exp) => {
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn: exp });
  },

  authToken: (req, res, next) => {
    try {
      const auth = jwt.verify(req.token, process.env.JWT_KEY);
      req.userId = auth.userId;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ code: 401, status: "UNAUTHORIZED", data: null, errors: error });
    }
  },

  isAdmin: async (req, res, next) => {
    try {
      let selectQuery = `select role from users where id = ?;`;
      const [[result]] = await db.execute(selectQuery, [req.userId]);
      if (result?.role.toUpperCase() !== "ADMIN") {
        return res.status(401).send({
          code: 401,
          status: "UNAUTHORIZED",
          data: null,
          errors: { role: "Require Admin Role." },
        });
      }
      next();
    } catch (error) {
      res
        .status(401)
        .send({ code: 401, status: "UNAUTHORIZED", data: null, errors: error });
    }
  },
};
