const jwt = require('jsonwebtoken');

function token_veryfier(req , res , next){
    const token = req.header('auth-token');
    if(!token ) return res.statuse(400).send("Access Denied");

    try {
        const verified = jwt.verify(token , process.env.TOKEN_SECREAT);
        req.user = verified;
        next()
    } catch (e) {
        res.statuse(400).send("invalid token")
    }
}

module.exports.token_veryfier = token_veryfier;