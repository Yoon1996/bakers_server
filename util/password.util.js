const crypto = require("crypto");

const getHash = (password) => {
    return crypto.createHash("sha512").update(password).digest("base64");

}
module.exports ={
    getHash
}