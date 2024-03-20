const express = require("express");
const app = express();
const cors = require("cors");

// packages for express cookie session
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const pool = require("./database"); //postgres connection details

require("dotenv").config(); //to access env variables from .env file

//storing session details to database
const sessionStore = new pgSession({
  pool: pool,
  tableName: "usersession",
  createTableIfMissing: true,
});

//express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "myExpressApp",
    cookie: {
      sameSite: "none",
      httpOnly: false,
      maxAge: 100 * 60 * 60 * 24,
      secure: true,
    },
  })
);

const postRouter = require("./routes/post.router");
const adminRouter = require("./routes/admin.router");

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(process.env.PORT, () => console.log("server running on port 5000"));
