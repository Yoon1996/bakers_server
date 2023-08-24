var express = require("express");
const User = require("../model/user.model");
const { getHash, compare } = require("../util/password.util");
const { tokenSign, tokenValidation } = require("../util/auth.util");
const { authMiddleware } = require("../middleware/auth.middleware");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//토큰 인증 api
router.get('/token-verify', (req, res) => {

  try {

    req.headers.authorization
    console.log('req.headers.authorization: ', req.headers.authorization);

    if(!req?.headers?.authorization) throw 'Unauthorized'
  
    const tokenList = req.headers.authorization.split(' ')
  
    if(tokenList.length < 1) throw 'Unauthorized'

    const token = tokenList[1]
    const userInfo = tokenValidation(token)
    res.json(userInfo)

  } catch(error){
    console.log('error: ', error);
    if(error === 'Unauthorized'){
    res.status(401).json({statusMessage: 'Unauthorized'})
  }else if(error.message === 'jwt expired'){
    res.status(401).json({statusMessage: 'Token Expired'})
  } else if(error.message === ''){
    res.status(500).json({statusMessage: "Internal server error"})
  }
  }


})
//아이디 유효성 확인 api
router.get("/nickname-check", async(req, res) => {

  req.headers.authorization
  console.log('req.headers.authorization: ', req.headers.authorization);

  if(!req?.query?.nickname) {
    res.status(400).json({statusMessage: "Invalid params"})
    return
  }
  const user = await User.findOne({where: {nickname:req.query.nickname}}) 

  if(user){
    // res.status(409).json({statusMessage: "Duplicated Nickname"})
    res.json({ isDuplicated: true})
    return
  }
  res.json({isDuplicated: false})
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
  });

  await createUser.save();

  res.json(createUser);
});

//로그인api

router.post('/login', async (req, res) => {

  
  
  const { nickname, password }  = req.body
  
  try {
    const user = await User.findOne({ where: { nickname } });
    // console.log('nickname: ', nickname);
    console.log('userpassword: ', user.password);

    if(!user) throw 'INVALID_USERNAME_OR_PASSWORD'


      const compareRes = compare(password, user.password)
      console.log('compareRes: ', compareRes);

      if(!compareRes) throw 'INVALID_USERNAME_OR_PASSWORD'

      //userinfo 에서 password 를 뺀 객체
      let {password: dummyPassword, ...userInfo} = user.toJSON()
      const accessToken = tokenSign(userInfo)
      userInfo = {...userInfo, accessToken}

      if(compareRes){
      return res.json(userInfo);
    } else {
      return res.json({ success: false, message: 'Invalid username or password' });
    }


    
  } catch (error) {
    console.error(error);
    if(error === 'INVALID_USERNAME_OR_PASSWORD'){
      return res.status(403).json({ success: false, message: 'Invalid username or password' });
    } else{
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
})


//로그아웃 api
router.post('/logout', async (req, res) => {
  
  res.json({ success: true, message: 'Logged out successfully' });
})

//내 정보 열람
router.get('/info', async (req, res) => {


  const userId = req.userInfo.id
  console.log('userId: ', userId);

  User.findOne


})

module.exports = router;
