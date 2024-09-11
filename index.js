const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const Blog = require('./models/blog.models');
const userRoute = require('./routes/user.routes');
const blogRoute = require('./routes/blog.routes');
const { checkForAuthenticationToken } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 9000;

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection setup
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// EJS setup for server-side rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationToken('token'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render('home', {
    user: req?.user,
    blogs: allBlogs,
  });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});