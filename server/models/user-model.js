const { DataTypes } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { not } = require("joi");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      department: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 5,
          notNull: true,
          notEmpty: true,
        },
      },
      employee: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // primaryKey: true,
        // foreignKey: true,
        validate: {
          min: 5,
          notNull: true,
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "使用者名稱已重覆",
        },
        validate: {
          min: 1,
          max: 20,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          min: 6,
          max: 255,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          isEmail: true,
        },
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "normal",
        validate: {
          isIn: {
            args: [["normal", "super"]],
            msg: "level必須是normal or super",
          },
        },
      },
    },
    {
      hooks: {
        beforeSave: async (user) => {
          console.log("正在經過User.beforeSave...");
          // if (this._options.isNewRecord) {
          const hashedValue = await bcryptjs.hash(user.password, 10);
          user.password = hashedValue;
          // }
        },
      },
    }
  );

  User.prototype.comparePassword = async function (password, cb) {
    let result;
    try {
      result = await bcryptjs.compare(password, this.password);
      return cb(null, result);
    } catch (e) {
      return cb(e, result);
    }
  };

  return User;
};
