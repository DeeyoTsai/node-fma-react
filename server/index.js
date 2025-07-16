const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const fmaRoute = require("./routes").fmatable;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// const dbConfig = require("./db.config");
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   logging: console.log,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
// });

// 連接mysql
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database: ", error);
//   });

// 刪除現有表並重新同步數據庫
const db = require("./models");
// 同步數據庫
db.sequelize.sync();

// 刪除現有表並重新同步數據庫
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
// fmtRoute需要被jwt保護
// 如果request header內部沒有jwt，request就會被視為unauthorized
app.use(
  "/api/fmaTable",
  passport.authenticate("jwt", { session: false }),
  fmaRoute
);

// 只有登入系統的人(有jwt)，才能填寫fma表單
// 用passport-jwt驗證json web token

app.listen(8080, () => {
  console.log("後端伺服器運行中...");
});
