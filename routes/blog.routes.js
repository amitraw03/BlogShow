const { Router } = require('express');
const router = Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const Blog = require('../models/blog.models');
const Comment = require('../models/comment.models');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      }
    });
    readableStream.pipe(uploadStream);
  });
};

//route to ADD BLOG
router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user: req.user,
  });
});

// ADD BLOG
router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;

    let coverImageURL = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageURL = result.secure_url;
    }

    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL
    });

    return res.redirect('/');
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).send('An error occurred while creating the blog.');
  }
});

// VIEW SINGLE BLOG
router.get('/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id).populate('createdBy');
      if (!blog) {
        return res.status(404).send('Blog not found');
      }
      const comments = await Comment.find({ blogId: blog._id }).populate('createdBy');
      res.render('blogDetail', { blog, comments, user: req.user });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).send('An error occurred while retrieving the blog.');
    }
  });
  
  // ADD COMMENT
  router.post('/comment/:blogId', async (req, res) => {
    try {
      const { blogId } = req.params;
      const { content } = req.body;
      const comment = await Comment.create({
        content,
        blogId,
        createdBy: req.user._id
      });
      await comment.populate('createdBy');
      res.json({ success: true, comment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ success: false, message: 'Error adding comment' });
    }
  });

module.exports = router;