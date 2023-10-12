var express = require("express");
const User = require("../model/user.model");
const { getHash, compare } = require("../util/password.util");
const { tokenSign, tokenValidation } = require("../util/auth.util");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//토큰 인증 api
router.get('/token-verify', (req, res) => {

  try {

    req.headers.authorization
    // console.log('req.headers.authorization: ', req.headers.authorization);

    if (!req?.headers?.authorization) throw 'Unauthorized'

    const tokenList = req.headers.authorization.split(' ')

    if (tokenList.length < 1) throw 'Unauthorized'

    const token = tokenList[1]
    const userInfo = tokenValidation(token)
    res.json(userInfo)

  } catch (error) {
    console.log('error: ', error);
    if (error === 'Unauthorized') {
      res.status(401).json({ statusMessage: 'Unauthorized' })
    } else if (error.message === 'jwt expired') {
      res.status(401).json({ statusMessage: 'Token Expired' })
    } else if (error.message === '') {
      res.status(500).json({ statusMessage: "Internal server error" })
    }
  }


})
//아이디 유효성 확인 api
router.get("/nickname-check", async (req, res) => {

  if (!req?.query?.nickname) {
    res.status(400).json({ statusMessage: "Invalid params" })
    return
  }
  const user = await User.findOne({ where: { nickname: req.query.nickname } })

  if (user) {
    // res.status(409).json({statusMessage: "Duplicated Nickname"})
    res.json({ isDuplicated: true })
    return
  }
  res.json({ isDuplicated: false })
})
//회원 가입 api
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
    withDraw: false,
  });

  await createUser.save();

  res.json(createUser);
});

//로그인api
router.post('/login', async (req, res) => {



  const { nickname, password } = req.body

  try {
    const user = await User.findOne({ where: { nickname } });
    // console.log('nickname: ', nickname);
    console.log('userpassword: ', user.password);

    if (!user) throw 'INVALID_USERNAME_OR_PASSWORD'


    const compareRes = compare(password, user.password)
    console.log('compareRes: ', compareRes);

    if (!compareRes) throw 'INVALID_USERNAME_OR_PASSWORD'

    //userinfo 에서 password 를 뺀 객체
    let { password: dummyPassword, ...userInfo } = user.toJSON()
    const accessToken = tokenSign(userInfo)
    userInfo = { ...userInfo, accessToken }

    if (compareRes) {
      return res.json(userInfo);
    } else {
      return res.json({ success: false, message: 'Invalid username or password' });
    }



  } catch (error) {
    console.error(error);
    if (error === 'INVALID_USERNAME_OR_PASSWORD') {
      return res.status(403).json({ success: false, message: 'Invalid username or password' });
    } else {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
})

//회원정보 수정api
router.put("/user/:userId", async (req, res) => {
  try {
    const userId = req.userInfo.id
    const { userData } = req.body

    await User.update({ name: userData.name, nickname: userData.nickname, email: userData.email, birth: userData.birth }, {
      where: {
        id: userId,
      }
    })
    const currentUser = await User.findOne({
      where: {
        id: userId
      }
    })
    res.json(currentUser)
  }
  catch (error) {
    console.log('error: ', error);
  }
})

//비밀번호 체크 api
router.post("/pw-check/", async (req, res) => {
  try {

    const { password } = req.body
    const userId = req.userInfo.id
    const user = await User.findOne({ where: { id: userId } })

    if (!user) throw 'INVALID_PASSWORD'

    const compareRes = compare(password, user.password)


    if (!compareRes) throw 'INVALID_PASSWORD'

    if (compareRes) {
      return res.json({ success: true })
    } else {
      return res.json({ success: false, message: "Invalid password" })
    }

  }
  catch (error) {
    console.log('error: ', error);
    if (error === "INVALID_PASSWORD") {
      return res.status(403).json({ statusMessage: "INVALID_PASSWORD" })
    } else {
      return res.status(500).json({ statusMessage: "Internet server error" })
    }
  }
})

//회원탈퇴 API
router.put("/user/", async (req, res) => {
  try {
    const userId = req.userInfo.id;
    await User.update({ name: null, nickname: "탈퇴회원", password: null, email: null, birth: null, withDraw: true }, {
      where: {
        id: userId
      }
    })
    res.json("탈퇴 성공")
  }
  catch (error) {
    res.status(500).json({ statusMessage: "Internal server error" })
  }
})

module.exports = router;
