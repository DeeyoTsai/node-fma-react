const dbConfig = require("../db.config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  timezone: dbConfig.timezone,
  logging: console.log,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user-model")(sequelize, Sequelize);
db.fmatbs = require("./fma-model")(sequelize, Sequelize);
db.outlines = require("./fma-outline-model")(sequelize, Sequelize);

// db.users.hasMany(db.fmatbs, {
//   foreignKey: {
//     sourceKey: "employee",
//     foreignKey: "id",
//   },
// });

// db.users.hasMany(db.fmatbs, {
//   foreignKey: "fmaEmployee",
//   sourceKey: "employee",
// });

// db.fmatbs.belongsTo(db.users, {
//   foreignKey: "fmaEmployee",
//   sourceKey: "employee",
// });

db.users.hasMany(db.outlines, {
  foreignKey: "emp",
  sourceKey: "employee",
});
db.outlines.belongsTo(db.users, {
  foreignKey: "emp",
  sourceKey: "employee",
});

// db.outlines.hasMany(db.fmatbs);
db.outlines.hasMany(db.fmatbs, { onDelete: "cascade" });
db.fmatbs.belongsTo(db.outlines);

module.exports = db;
