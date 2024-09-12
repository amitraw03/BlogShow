const express = require ('express');
require('dotenv').config();
const path = require('path');
const mongoose = require ('mongoose');
const cookieParser = require('cookie-parser');

const Blog= require('./models/blog.models')

const userRoute= require('./routes/user.routes');
const blogRoute = require('./routes/blog.routes');

const { checkForAuthenticationToken } = require('./middlewares/auth');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app= express();
const PORT = process.env.PORT || 9000;

//connecting with D.B
const mongoURL =  process.env.MONGO_URL

mongoose.connect(mongoURL)
.then(()=> console.log('Mongo DB Connected Successfully'))
.catch(err => console.error('MongoDB connection error:', err));

//FOr Server side rendering We r using EJS--
app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended:false}));

app.use(cookieParser());  // required config
app.use(checkForAuthenticationToken('token'));

app.use(express.static(path.resolve('./public'))) // necessary to load local images on express server 

app.get('/', async(req,res)=>{
    // console.log(req.user);
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 }); 
    res.render('home',{  // here i am sending stored user data{which we get from checkAuthToken functn} to ejs files
        user:req?.user,
        blogs:allBlogs,
    });
});

app.use('/user',userRoute); //handling user routes
app.use('/blog',blogRoute); //handling blog routes

app.listen(PORT, ()=>{
    console.log(`Server started at PORT:${PORT}`); 
})