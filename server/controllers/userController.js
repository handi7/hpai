const db = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
  getUsers: async (req, res) => {
    try {
      let selectQuery = `select id, name, email, role from users;`;
      const [result] = await db.execute(selectQuery);
      res
        .status(200)
        .send({ code: 200, status: "OK", data: result, errors: null });
    } catch (error) {
      res.status(500).send({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        data: null,
        errors: error,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      let selectQuery = `select id, name, email, role from users where id = ?;`;

      const [[result]] = await db.execute(selectQuery, [req.params.id]);
      if (!result) {
        return res.status(404).send({
          code: 404,
          status: "NOT_FOUND",
          data: null,
          errors: { id: "User Not Found." },
        });
      }

      res
        .status(200)
        .send({ code: 200, status: "OK", data: result, errors: null });
    } catch (error) {
      res.status(500).send({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        data: null,
        errors: error,
      });
    }
  },

  createUser: async (req, res) => {
    try {
      let insertQuery = `insert into users (name, email, password, role) values (?, ?, ?, ?);`;
      let checkEmailQuery = `select id from users where email = ?;`;

      const [[result]] = await db.execute(checkEmailQuery, [req.body.email]);
      if (result?.id) {
        return res.status(409).send({
          code: 409,
          status: "CONFLICT",
          data: null,
          errors: { email: "Email Already Exist." },
        });
      }

      const [result2] = await db.execute(insertQuery, [
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        req.body.role,
      ]);

      res.status(200).send({
        code: 200,
        status: "OK",
        data: result2,
        errors: null,
      });
    } catch (error) {
      res.status(500).send({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        data: null,
        errors: error,
      });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      let deleteQuery = `delete from users where id = ?;`;

      const [result] = await db.execute(deleteQuery, [req.params.id]);
      if (!result.affectedRows) {
        return res.status(404).send({
          code: 404,
          status: "NOT_FOUND",
          data: null,
          errors: { deleted: 0 },
        });
      }

      res.status(200).send({
        code: 200,
        status: "OK",
        data: { deleted: result.affectedRows },
        errors: null,
      });
    } catch (error) {
      res.status(500).send({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        data: null,
        errors: error,
      });
    }
  },
};
