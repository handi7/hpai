const db = require("../config/db");
const bcrypt = require("bcrypt");
const { createToken } = require("../helper/jwt");

module.exports = {
  login: async (req, res) => {
    try {
      //   console.log(bcrypt.hashSync("@Monday123", bcrypt.genSaltSync(10)));
      let selectQuery = `select * from users where email = ?;`;

      const [[user]] = await db.execute(selectQuery, [req.body.email]);
      if (!user) {
        return res
          .status(404)
          .send({ message: "Error", data: null, errors: "User Not Found." });
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res
          .status(401)
          .send({ message: "Error", data: null, errors: "Wrong Password." });
      }

      const token = `Bearer ${createToken(
        {
          userId: user.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
        },
        "12h"
      )}`;

      res.status(200).send({
        code: 200,
        status: "OK",
        data: {
          id: user.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
        },
        token,
        errors: null,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", data: null, errors: error });
    }
  },

  keepLogin: async (req, res) => {
    try {
      let selectQuery = `select id, name, email, role from users where id = ?;`;

      const [[result]] = await db.execute(selectQuery, [req.userId]);

      const token = `Bearer ${createToken(
        {
          userId: result.id,
          name: result?.name,
          email: result?.email,
          role: result?.role,
        },
        "12h"
      )}`;

      res.status(200).send({
        code: 200,
        status: "OK",
        data: {
          id: result.id,
          name: result?.name,
          email: result?.email,
          role: result?.role,
        },
        token,
        errors: null,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", data: null, errors: error });
    }
  },
};
