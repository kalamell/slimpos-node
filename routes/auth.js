const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation }=  require('../validation');
const bcrypt = require('bcryptjs');



router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(200).json({result: false, msg: error});
    
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(200).json({result: false, msg: 'Email already exists'});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name, 
        email: req.body.email,
        password: hashedPassword
    });
    
    try {
        const saveUser = await user.save();
        res.status(200).json({result: true, data: {
            user: user._id
        }});
    } catch(err) {
        res.status(200).json({result: false, msg: err});
    }
});

router.post('/login', async (req, res) => {
   const { error } = loginValidation(req.body);
   if (error) return res.status(200).json({result: false, msg: 'Login Error'});
   
   const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(200).json({result: false, msg: 'Email not found'});

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(200).json({result: false, msg: 'invalid password'});
    const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);
    await User.findOneAndUpdate({email: req.body.email}, {
        token
    });
    
    return res.status(200).json({
        result: true,
        data: {
            user: {
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                token: token,
            }
        }
    })
})

module.exports = router;

