const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.post("/", postController.create);
router.put("/:id", postController.updateById);
router.delete("/:id", postController.deleteById);

module.exports = router;
