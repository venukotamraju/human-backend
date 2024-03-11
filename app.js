const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

const postRouter = require("./routes/post.router");

app.use("/api/v1/posts", postRouter);

app.listen(process.env.PORT, () => console.log("server running on port 5000"));
