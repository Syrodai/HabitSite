const jwt = require("jsonwebtoken");

// time until expiration in seconds
const TOKEN_DURATION = 3600;

function verifyRequestToken(req) {
    try {
        const now = Math.floor(Date.now() / 1000);

        let auth = req.get('Authorization');
        token = auth.substring(auth.indexOf(' ') + 1);

        let tokenJSON;
        const claimedUser = req.get('User');
        try {
            tokenJSON =  jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return { success: false, message: "Invalid Token" };
        }

        if (tokenJSON.username !== claimedUser)
            return { success: false, message: "Token User Mismatch" };

        if (tokenJSON.iat === undefined || now - tokenJSON.iat > TOKEN_DURATION)
            return { success: false, message: "Token Expired" };

        return { success: true, message: tokenJSON.username };

    } catch (err) {
        console.log("Unknown Request Verification Error", err);
        return { success: false, message: "Unknown Request Verification Error" };
    }
}

module.exports = {
    verifyRequestToken,
}