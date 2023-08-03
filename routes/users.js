var express = require("express");
const User = require("../model/user.model");
const { getHash } = require("../util/password.util");
const { promiseImpl } = require("ejs");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/nickname-check", async(req, res) => {
  User.find
})

router.post("/sign-up", async (req, res) => {
  // res.send("aaaa");
  // const email = 'test@namer.com'
  // const password = '1234'
  const { id, nickname, password, email, name, birth } = req.body;

  const dupRes = await Promise.all([
    User.findOne({ where: { nickname } }),
    User.findOne({ where: { email } }),
  ]);

  if (dupRes[0]?.id) {
    res.status(409).json({ statusMessage: "Duplicated nickname" });
    return;
  }

  if (dupRes[1]?.email) {
    res.status(409).json({ statusMessage: "Duplicated email" });
    return;
  }

  const createUser = await User.create({
    id,
    nickname,
    email,
    name,
    birth,
    password: getHash(password),
  });

  await createUser.save();

  res.json(createUser);
});

module.exports = router;
