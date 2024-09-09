const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');

const userRoute= require('./routes/user.routes');
const { log } = require('console');
const exp = require('constants');

const app= express();
const PORT = 9000;

mongoose.connect('mongodb://localhost:27017/blogshow')
.then(()=> console.log('Mongo DB Connected Successfully'))
.catch(err => console.error('MongoDB connection error:', err));

//FOr Server side rendering We r using EJS
app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render('home');
})

app.use('/user',userRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at PORT:${PORT}`); 
})