const router = require("express").Router();
const { Op, where } = require("sequelize");
const db = require("../models");
const { fmatable } = require(".");
// const { date } = require("joi");
const User = db.users;
const Fmatbs = db.fmatbs;
const Outlines = db.outlines;

// Middleware test
router.use((req, res, next) => {
  // console.log("正在經過fma-table-route...");
  next();
});
// 新增一筆outline data
router.post("/fmaOutline", async (req, res) => {
  const { outlineData } = req.body;
  const employee = outlineData.emp;

  const datetime = new Date(outlineData.datetime).toLocaleString("sv");
  outlineData.datetime = datetime;
  const employeeCheck = User.findOne({ where: { employee } });

  if (!employeeCheck) {
    return res.status(401).send("找不到此工號的使用者，請先註冊帳號");
  }

  try {
    const savedFmaOutline = await Outlines.create({
      emp: outlineData.emp,
      line: outlineData.line,
      product: outlineData.product,
      lot: outlineData.lot,
      first: outlineData.first,
      second: outlineData.second,
      third: outlineData.third,
      datetime: outlineData.datetime,
    });
    return res.send({
      msg: "Outline data儲存成功",
      savedFmaOutline,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ msg: `Outline資料格式錯誤，無法新增至資料庫` });
  }
});
// 刪除一筆outline data
router.delete("/fmaOutlineRow/:id", async (req, res) => {
  const { id } = req.params;
  console.log("route_id" + id);
  try {
    const foundData = await Outlines.findOne({
      where: {
        id,
      },
    });
    if (!foundData) {
      return res.status(400).send({ msg: `資料庫內找不到${id}的資料` });
    }
    // 刪除資料
    await foundData.destroy();
    return res.send({
      msg: `資料id=${id}，刪除成功!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "資料錯誤，無法刪除" });
  }
});

// 新增一筆glass fma資料
router.post("/glassData", async (req, res) => {
  const { line, date, product, gid, runder, gunder, rwp, rgel, employee } =
    req.body;
  const employeeCheck = User.findOne({ where: { employee } });

  if (!employeeCheck) {
    return res.status(401).send("找不到此工號的使用者，請先註冊帳號");
  }
  // fma by sheet post request
  try {
    const savedSheetData = await Fmatbs.create({
      line,
      date,
      product,
      gid,
      runder,
      gunder,
      rwp,
      rgel,
      fmaEmployee: employee,
    });
    return res.send({
      msg: `${gid}資料儲存成功`,
      savedSheetData,
    });
  } catch (e) {
    console.log("error!!!");
    return res.status(500).send(e);
  }
});

// 新增多筆glass fma資料
router.post("/glassDataSet", async (req, res) => {
  const { employee, sheetDataSet } = req.body;
  const employeeCheck = User.findOne({ where: { employee } });
  if (!employeeCheck) {
    return res.status(401).send("找不到此工號的使用者，請先註冊帳號");
  }
  console.log(sheetDataSet);
  try {
    const savedGlasses = await Fmatbs.bulkCreate(sheetDataSet);
    return res.send({ msg: "資料儲存成功!", savedGlasses });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ msg: `GlassDataSet資料格式錯誤，無法新增至資料庫` });
  }
});

//查詢多筆glass fma data by OutlineId
router.get("/glassDataSet/:id", async (req, res) => {
  const { id } = req.params;
  // console.log("fma-table-router...");
  // console.log(id);

  try {
    const foundData = await Fmatbs.findAll({
      where: {
        outlineId: id,
      },
    });
    console.log("Successfully get data");
    console.log(foundData);

    return res.send({
      msg: `成功取得fmatable資料庫，outlineId=${id}的資料`,
      foundData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      msg: `fmatable資料庫內查無outlineId=${id}的資料`,
    });
  }
});

// 以工號、日期、line、product查詢glassData
// router.get("/:empId/:dt/:line/:product", async (req, res) => {
router.get("/:queryparams", async (req, res) => {
  let { queryparams } = req.params;
  let [emp, lot, line, product, sdate, edate] = queryparams.split("_");

  // 移除空欄位項目
  let queryItems = Object.assign({}, { emp }, { lot }, { line }, { product });
  queryItems = Object.keys(queryItems)
    .filter((k) => queryItems[k] !== "")
    .map((e) => ({ [e]: queryItems[e] }));

  if (sdate != "") {
    // DATE format轉成yyyy-mm-dd格式
    sdate = new Date(sdate).toISOString().split("T")[0];
  }
  if (edate != "") {
    // DATE format轉成yyyy-mm-dd格式
    edate = new Date(edate).toISOString().split("T")[0];
  }
  console.log(queryItems);

  try {
    const foundData = await Outlines.findAll({
      where: {
        [Op.and]: [
          queryItems,
          {
            datetime: {
              [Op.between]: [
                new Date(sdate + " 00:00:00"),
                new Date(edate + " 23:59:59"),
              ],
            },
          },
        ],
      },
    });

    return res.send({
      msg: `成功取得工號:${emp}所有fma資料`,
      foundData,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 更新一筆glass fma資料
router.patch("/:line/:dt/:glassid", async (req, res) => {
  let { line, dt, glassid } = req.params;
  // DATE format轉成yyyy-mm-dd格式
  dt = new Date(dt).toISOString().split("T")[0];
  try {
    // 用req.params的line, dt, glassid確認該筆資料是否存在
    const foundData = await Fmatbs.findOne({
      where: {
        [Op.and]: [{ line: line }, { date: dt }, { gid: glassid }],
      },
    });

    if (!foundData) {
      return res
        .status(400)
        .send(`資料庫內找不到${line}-${dt}-ID:${gid}的資料`);
    }
    // req.body修改資料內容
    const { product, runder, gunder, rwp, rgel } = req.body;
    const changedData = await Fmatbs.update(
      {
        product,
        runder,
        gunder,
        rwp,
        rgel,
      },
      {
        where: { [Op.and]: [{ line: line }, { date: dt }, { gid: glassid }] },
      }
    );
    // console.log("changedData" + changedData);
    if (changedData) {
      return res.send({
        msg: `${glassid}資料修改成功`,
      });
    } else {
      return res.status(400).send("資料更新失敗!!");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除一筆glass fma資料
router.delete("/:line/:dt/:glassid", async (req, res) => {
  let { line, dt, glassid } = req.params;
  // DATE format轉成yyyy-mm-dd格式
  dt = new Date(dt).toISOString().split("T")[0];
  try {
    // 用req.params的line, dt, glassid確認該筆資料是否存在
    const foundData = await Fmatbs.findOne({
      where: {
        [Op.and]: [{ line: line }, { date: dt }, { gid: glassid }],
      },
    });

    if (!foundData) {
      return res
        .status(400)
        .send(`資料庫內找不到${line}-${dt}-ID:${gid}的資料`);
    }
    // 刪除資料
    await foundData.destroy();
    return res.send({
      msg: `${glassid}資料刪除成功!`,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
