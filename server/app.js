const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

const PORT = process.env.PORT || 3030;

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공!");
  })
  .catch(console.error);
passportConfig();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/user", userRouter);

app.use(express.static("build"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(PORT, () => {
  console.log("서버 실행 중...");
});
