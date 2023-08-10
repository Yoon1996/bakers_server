// const crypto = require("crypto");

// const getHash = (password) => {
//     return crypto.createHash("sha512").update(password).digest("base64");

// }

// const salt = crypto.randomBytes(16).toString('hex');
//솔트 생성

//해쉬드 패스워드 생성
//최종 비밀번호 = 해쉬드 패스워드 + 솔트
//

// const passwordCheck = (hashedPassword, password) => {
//     return crypto.check
// }

//becrpt 사용
const bcrypt = require('bcrypt');

const hash =  (password) => {
    return bcrypt.hashSync(PW, salt);
}
module.exports ={
    
}