const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const cookieParser = require('cookie-parser');

const userRoute= require('./routes/user.routes');
const { checkForAuthenticationToken } = require('./middlewares/auth');

const app= express();
const PORT = 9000;

mongoose.connect('mongodb://localhost:27017/blogshow')
.then(()=> console.log('Mongo DB Connected Successfully'))
.catch(err => console.error('MongoDB connection error:', err));

//FOr Server side rendering We r using EJS
app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationToken('token'));

app.get('/',(req,res)=>{
    console.log(req.user); 
    res.render('home',{
        user:req?.user,
    });
});

app.use('/user',userRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at PORT:${PORT}`); 
})