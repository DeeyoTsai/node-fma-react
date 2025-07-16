const router = require("express").Router();
const db = require("../models");
// const createUserValidation = require("../vaidation").createUserValidation;
const User = db.users;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  // console.log("正在經過auth有關的請求...");
  next();
});

router.get("/testAPI", (req, res) => {
  console.log("成功連結auth route....");

  return res.send("成功連結auth route....");
});
// 新增使用者
router.post("/createUser", async (req, res) => {
  // // 使用 Joi驗證使用者post資料
  // let { error } = createUserValidation(req.body);
  // // console.log(req.body);
  // if (error) return res.status(400).send(error);
  // console.log(req.body.employee);

  // 用employee_id確認是工號是否已被註冊
  const employeeExist = await User.findOne({
    where: { employee: req.body.employee },
  });
  // 確認資料庫是否有相同工號
  if (employeeExist) {
    console.log("此工號已註冊....");
    return res.status(400).send({
      msg: `${req.body.employee}此工號已被註冊...`,
    });
  }
  // Fetch data from request body
  const { department, employee, username, password, email, level } = req.body;
  // Save newUser in database，create = build + save
  try {
    let savedUser = await User.create({
      department,
      employee,
      username,
      password,
      email,
      level,
    });
    return res.send({
      msg: `使用者:${employee}，已成功被儲存!`,
      savedUser,
    });
  } catch (e) {
    res.status(500).send({
      msg: `無法儲存，使用者:${employee}!`,
      e,
    });
  }
});

// 使用者登入
router.post("/login", async (req, res) => {
  // 確認使用者是否被註冊
  const foundUser = await User.findOne({
    where: { employee: req.body.employee },
  });
  if (!foundUser) {
    return res.status(401).send({
      msg: "找不到此工號的使用者，請先註冊帳號",
    });
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      // 製作jwt的token內容
      const tokenObject = {
        employee: foundUser.employee,
        password: foundUser.password,
      };
      // token內容加入SECRET發送給client
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入!!!",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send({
        msg: "密碼錯誤!!",
      });
    }
  });
});

// 使用者登出

// 查詢所有使用者資料
router.get("/allUsers", async (req, res) => {
  try {
    let foundUsers = await User.findAll({
      // attributes: ["id", "employee", "email"],
      attributes: { exclude: ["password"] },
    });
    return res.send(foundUsers);
  } catch (e) {
    return res.send(500).send(e);
  }
});

// 依工號查詢使用者資料
router.get("/:employee", async (req, res) => {
  const { employee } = req.params;
  try {
    let foundUser = await User.findOne({ employee });
    return res.send(foundUser);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 更新使用者資料
router.patch("/:employee", async (req, res) => {
  const { employee } = req.params;
  // const { password, email } = req.body;
  try {
    const foundUser = await User.findOne({ employee });
    console.log(foundUser.employee);
    console.log(employee);

    if (!foundUser) {
      return res.status(400).send(`找不到工號:${employee}的使用者`);
    }
    if (foundUser.employee == employee) {
      console.log(req.body);

      let updateUser = await User.update(req.body, {
        where: {
          employee,
        },
      });
      return res.send({
        message: "使用者資料修改成功!",
        updateUser,
      });
    } else {
      return res.status(403).send("只有本人才可修改資料");
    }
  } catch (e) {
    return res.status(403).send(e);
  }
});

module.exports = router;
