const {Router} = require('express');
const router=Router();
const multer=require('multer');
const path=require('path');
const fs = require('fs');

const Blog= require('../models/blog.models')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user ? req.user._id : 'anonymous';
        const userUploadPath = path.resolve(`./public/uploads/${userId}`);
        
        // Create user-specific directory if it doesn't exist
        fs.mkdirSync(userUploadPath, { recursive: true });
        
        cb(null, userUploadPath);
    },
    filename: function (req, file, cb) {
        const today = new Date().toISOString().split('T')[0]; // Gets YYYY-MM-DD
        const fileName = `${today}-${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    },
  });

  const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
});

router.post('/', upload.single('coverImage') ,async(req,res)=>{  // here / means /blog
    // console.log(req.body);  // all data which we r entering in the form
    // console.log(req.file);
    try {
        const { title, body } = req.body;
        
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`
        });

        // After the blog is created, it will have an _id
        return res.redirect('/'); // Redirect to the newly created blog's page
    } catch (error) {
        console.error('Error creating blog:', error);
        return res.status(500).send('An error occurred while creating the blog.');
    }
})

router.get('/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        res.render('blogDetail', {
            blog,
            user: req.user,  // Pass user data if available
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return res.status(500).send('An error occurred while retrieving the blog.');
    }
});


module.exports=router;