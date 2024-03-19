const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.get("/name/:post_title", postController.getByName);
router.post("/", postController.create);
router.put("/:id", postController.updateById);
router.delete("/:id", postController.deleteById);

module.exports = router;
