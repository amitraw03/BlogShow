const { validateToken } = require("../utils/authentication");

function checkForAuthenticationToken(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        console.log(tokenCookieValue);
        
        if (!tokenCookieValue) {
            req.user = null;  // Set req.user to null if no token
            return next();
        }
        
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;  // Set the decoded user payload
        } catch (error) {
            req.user = null;  // In case of token validation error, set to null
            console.error('Token validation error:', error);
        }
        
       return  next();  // Ensure next() is called at the end
    };
}

module.exports = { checkForAuthenticationToken };
