const jwt = require('jsonwebtoken');
require('dotenv').config();

function createToken(user) {
    const token =  jwt.sign({id:user.id,type:user.type},process.env.SECRET,{ expiresIn: '1h' })
    console.log(token);
    return token;
}

module.exports = {createToken}