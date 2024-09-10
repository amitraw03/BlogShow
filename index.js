const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const cookieParser = require('cookie-parser');

const Blog= require('./models/blog.models')

const userRoute= require('./routes/user.routes');
const blogRoute = require('./routes/blog.routes');

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
app.use(express.static(path.resolve('./public'))) // necessary to load local images on express server

app.use(cookieParser());
app.use(checkForAuthenticationToken('token'));

app.get('/', async(req,res)=>{
    // console.log(req.user);
    const allBlogs = await Blog.find({}); 
    res.render('home',{  // here i am sending stored user data{which we get from checkAuthToken functn} to ejs files
        user:req?.user,
        blogs:allBlogs,
    });
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at PORT:${PORT}`); 
})