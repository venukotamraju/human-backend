const pool = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const adminController = {
  create: (req, res) => {
    try {
      bcrypt.hash(req.body.key, saltRounds, (err, hash) => {
        if (err) {
          console.log("error from hashing: ", err);
        }
        pool.query(
          "INSERT INTO users (user_email,user_key,user_role) VALUES ($1,$2,$3) RETURNING *",
          [req.body.email, hash, 1],
          (err1, result) => {
            if (err1) {
              console.log("error from creating user: ", err1);
            }
            res.json({ message: "OK", data: result.rows });
          }
        );
      });
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  createLoginSession: (req, res) => {
    // req body objs - req.body.email, req.body.key
    try {
      pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [req.body.email],
        (err, result) => {
          if (err) {
            console.log(
              "error from selecting user with email from users: ",
              err
            );
          }
          if (result.rows.length > 0) {
            bcrypt.compare(
              req.body.key,
              result.rows[0].user_key,
              (compareErr, compareResult) => {
                if (compareResult) {
                  req.session.adminAuth = {
                    adminLogin: true,
                    adminData: result.rows[0],
                  };
                  res.json({
                    message: "OK",
                    logIn: {
                      adminLogin: true,
                      adminData: result.rows[0],
                    },
                  });
                } else {
                  res.json({
                    message:
                      "You have entered the wrong Key Admin, please try again",
                  });
                }
                if (compareErr) {
                  console.log("error from comparing hashes: ", compareErr);
                }
              }
            );
          } else {
            res.json({
              message: "YOU ARE NOT ADMIN! PLEASE GET OUT OF THIS PAGE",
            });
          }
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  deleteLoginSession: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("error from destroying session: ", err);
      }
      res.clearCookie("myExpressApp", { path: "/" });
      res.json({
        message: "OK",
      });
    });
  },
  getLoginSession: (req, res) => {
    if (req.session.adminAuth) {
      res.json({ adminAuth: req.session.adminAuth });
    } else {
      res.json({ adminAuth: false });
    }
  },
};
module.exports = adminController;
