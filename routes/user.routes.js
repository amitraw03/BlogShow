const {Router} = require('express');
const User = require('../models/user.models');

const router = Router();
//We are handling controllers on hitting routing endpoints here only

router.get('/signin',(req,res)=>{
    return res.render('signin');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.matchPassword(email, password); // Match password using bcrypt
        console.log(user);
        return res.redirect('/');
    } catch (error) {
        console.error(error.message);
        res.status(400).send('Invalid credentials');
    }
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    // Create the user with the hashed password
    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect('/');
});

module.exports=router;