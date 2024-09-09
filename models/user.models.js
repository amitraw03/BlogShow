const bcrypt= require('bcrypt');

const { Schema,model} = require("mongoose");

const userSchema = Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'/images/default.png',
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    },
},{tiemstamps:true});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it has been modified or is new
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.static('matchPassword', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not Found!!');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Incorrect Password !!');
    
    return user;
});

const User= model('User',userSchema); 

module.exports= User;

