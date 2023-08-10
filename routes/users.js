var express = require("express");
const User = require("../model/user.model");
const { getHash } = require("../util/password.util");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/nickname-check", async(req, res) => {
  console.log(req.query);
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

  const { nickname }  = req.body
  
  
  
  try {
    const user = await User.findOne({ where: { nickname } });
    // console.log('nickname: ', nickname);
    console.log('userpassword: ', user.password);
    if (user && user.password) {
      return res.json({ success: true, message: 'Login successful', nickname: nickname, password: user.password});

    } else {
      return res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // User.findOne({ where: { password } })

  

//  아이디와 비번이 없을경우
  // if(req?.body?.nickname || !req?.body?.password){
  //   res.status(409).json({statusMessage: "Invalid params"})
  //   return
  // }

  // if(req?.body?.nickname){
  //   res.status(409).json({statusMessage: "Invalid params"})
  //   return
  // }
  
  // const loginParams = req.body

  // if(!user){
  //   res.status(409).json({statusMessage: "User Not Found"})
  //   return
  // }


  // loginParams.password
})

module.exports = router;
