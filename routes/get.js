const router = require('express').Router();
// const verify = ('./verifyToken.js');
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

router.get('/' , token_veryfier , (req , res )=>{
    res.json({
        posts: {
            title : "my first post ",
            description: " random dat you should access"
        }
    })
})

module.exports = router;