const pool = require("../database");
const postController = {
  getAll: ({ res }) => {
    try {
      pool.query("SELECT * FROM post", (err, result) => {
        if (err) {
          console.log("error from fetching posts from database: ", err);
        }
        res.json({ message: "OK", data: result["rows"] });
      });
    } catch (error) {
      res.json({ message: error });
    }
  },
  getById: (req, res) => {
    try {
      pool.query(
        "SELECT * FROM post WHERE post_id = $1",
        [req.params.id],
        (err, result) => {
          if (err) {
            console.log("error from fetching post by id: ", err);
          }
          if (result.rows[0]) {
            return res.json({ message: "OK", data: result.rows[0] });
          }
          res.status(404).json({ message: "not found" });
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  getByName: (req, res) => {
    try {
      pool.query(
        "SELECT * FROM post WHERE post_title = $1",
        [req.params.post_title],
        (err, result) => {
          if (err) {
            console.log("error from fetching post by title: ", err);
          }
          if (result.rows[0]) {
            return res.json({ message: "OK", data: result.rows[0] });
          }
          res.status(404).json({ message: "not found" });
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  create: (req, res) => {
    try {
      pool.query(
        "INSERT INTO post (post_title,post_image_link,post_content,post_domain,post_date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [
          req.body.title,
          req.body.image,
          req.body.content,
          req.body.domain,
          req.body.date,
        ],
        (err, result) => {
          if (err) {
            console.log("error posting to the database: ", err);
          }
          res.json({ message: "OK", data: result.rows[0] });
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  updateById: (req, res) => {
    try {
      pool.query(
        "UDPATE post SET post_image_link = $1, post_content = $2, post_domain = $4 WHERE post_id = $5 RETURNING * ",
        [req.body.image, req.body.content, req.body.domain, req.params.id],
        (err, result) => {
          if (err) {
            console.log("error from updating post: ", err);
          }
          res.json({ message: "OK", data: result.rows[0] });
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
  deleteById: (req, res) => {
    try {
      pool.query(
        "DELETE FROM post WHERE post_id = $1 RETURNING *",
        [req.params.id],
        (err, result) => {
          if (err) {
            console.log("error from deleting post: ", err);
          }
          if (result) {
            res.json({ message: "OK" });
          }
        }
      );
    } catch (error) {
      res.json({ message: error.msg });
    }
  },
};

module.exports = postController;
