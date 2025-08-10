module.exports = {
  HOST: "localhost",
  USER: "deeyo",
  PASSWORD: "deeyo0312",
  DB: "node-fma",
  dialect: "mysql",
  timezone: "+08:00",
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// const sequelize = new Sequelize("node-fma", "deeyo", "deeyo3834", {
//   host: "localhost",
//   dialect: "mysql",
//   logging: console.log,
// });
