const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const fmatb = sequelize.define("fmatb", {
    // fmaEmployee: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     min: 5,
    //     notNull: true,
    //     notEmpty: true,
    //   },
    // },
    // line: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     min: 2,
    //     max: 5,
    //   },
    // },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // product: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     min: 4,
    //     max: 20,
    //   },
    // },
    gid: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // min: 5,
        notNull: true,
        notEmpty: true,
      },
    },
    runder: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    gunder: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bunder: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bmwp: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    rwp: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    gwp: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bwp: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    rgel: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    ggel: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bgel: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    rdevabnormal: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    gdevabnormal: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bdevabnormal: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    rfiber: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    gfiber: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bfiber: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bp: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    bmdirty: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    repair: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    abovep: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    backdirty: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    dirty: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    ovendrop: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    black: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    s: {
      type: DataTypes.SMALLINT.UNSIGNED,
    },
    m: {
      type: DataTypes.SMALLINT.UNSIGNED,
    },
    l: {
      type: DataTypes.SMALLINT.UNSIGNED,
    },
    otherdf: {
      type: DataTypes.STRING,
    },
  });
  return fmatb;
};
