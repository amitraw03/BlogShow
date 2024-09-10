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
        const {user,token} = await User.matchPasswordAndGenerateToken(email, password); // Match password using bcrypt
        // console.log(user);
        return res.cookie('token',token).redirect('/');
    } 
    catch (error) {
        return res.render('signin',{
            error:'Incorrect Email or Password',
        });
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

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('signin');
})


module.exports=router;