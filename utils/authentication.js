const JWT = require('jsonwebtoken');

const secret= "$uupraa@3004";

function createTokenForUser(user){
    // console.log(user);
    const payload={
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        profileImageURL: user.profileImageURL,
        role:user.role,
    };

    const token= JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (error) {
        // Handle the token validation error (e.g., invalid or expired token)
        console.error('Token validation error:', error.message);
        return null;  // Return null in case of an invalid token
    }
}

module.exports ={createTokenForUser,validateToken};