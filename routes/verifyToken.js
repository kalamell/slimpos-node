const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = async function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({
        result: false, 
        msg: 'Access Denied'
    });

    const user = await User.findOne({token});
    if (!user) return res.status(401).json({
        result: false,
        msg: 'Token expired'
    });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).json({
            reslut: false, 
            msg: err
        })
    }
}