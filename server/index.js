const express = require('express');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors')
const app = express();
const db = require("./db.js");
const auth = require("./auth.js");

app.use(cors());
app.use(bodyParser.json());
// $env:JWT_SECRET="keygoeshere" in powershell temporarily. Refer to config file later.
// config file:
//  JWT_SECRET
//  ports
//  jwt token duration
if (!process.env.JWT_SECRET) {
    console.log("JWT_SECRET not set! Set the secret key and restart.");
    process.exit(1);
}

// --------------------------------- AUTHORIZATION -----------------------------------

// get salt request
//  req body: username
//  res body: salt
app.get("/api/salt/:username", async (req, res) => {
    const username = req.params.username.toLowerCase();
    console.log("salt request for "+username);
    const salt = await db.getUserSalt(username);
    if (salt) {
        console.log("sending salt for " + username);
        res.status(200).send(salt);
    } else {
        console.log("no salt to give for " + username);
        res.status(404).send("Failed to retrieve salt")
    }
});

// login
app.post("/api/login", async (req, res) => {
    let { username, passwordHash } = req.body;
    username = username.toLowerCase();
    const verified = await db.verifyHash(username, passwordHash);

    if (verified) {
        const jwtToken = jwt.sign({ username: username, iat: Math.floor(Date.now() / 1000)  }, process.env.JWT_SECRET); // environment variable
        console.log("Successful login for " + username);
        res.status(200).json({ token: jwtToken });
    } else {
        console.log("Failed login for " + username);
        res.status(400).json({ message: "Invalid username or password" });
    }
})

// get local storage key
app.get("/api/local", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    const key = await db.getUserLocalStorageKey(verification.message);
    if (key) {
        res.status(200).json({ success: true, message: key });
    } else {
        res.status(400).json({ success: false, message: "User not found", isTokenError: false });
    }
})

// ------------------------------ ACCOUNT ACTIONS -------------------------------------------

// check if user auth exists
app.get("/api/create/:username", async (req, res) => {
    const username = req.params.username.toLowerCase();
    const exists = await db.checkUserExists(username);

    if (exists) {
        res.status(200).json({ exists: true, salt: undefined })
    } else {
        const newSalt = crypto.randomBytes(16).toString('hex');
        res.status(200).json({ exists: false, salt: newSalt })
    }
})

// validate and create user
app.post("/api/create", async (req, res) => {
    let username, passwordHash, salt;
    try {
        ({ username, passwordHash, salt } = req.body);
        username = username.toLowerCase();
    } catch (err) {
        res.status(400).json({ success: false, message: "Malformed Post Request"});
    }
    const exists = await db.checkUserExists(username);

    if (exists) {
        res.status(400).json({ success: false, message: "User already exists." });
    } else {
        console.log("Creating new user " + username);
        const localStorageKey = crypto.randomBytes(16).toString('hex');
        await db.createNewUserData(username);
        res.status(200).json({ success: true, user: await db.createNewUser(username, passwordHash, salt, localStorageKey) });
    }
})

// close an account by deleting auth and data from database
app.delete("/api/closeAccount", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    if (await db.deleteAccount(verification.message)) {
        console.log(verification.message + " has closed their account");
        res.status(200).json({ success: true, message: "Account was deleted successfully"});
    } else {
        res.status(400).json({ success: false, message: "User not found", isTokenError: false });
    }
})

// change the password for an account
app.post("/api/changepassword", async (req, res) => {
    let { username, currentPasswordHash, newPasswordHash, salt, data } = req.body;
    const verified = await db.verifyHash(username, currentPasswordHash);
    if (verified) {
        const newLocalStorageKey = crypto.randomBytes(16).toString('hex');
        await db.updateUserData(username, data);
        await db.updateUserSalt(username, salt);
        await db.updateUserPasswordHash(username, newPasswordHash);
        await db.updateUserLocalStorageKey(username, newLocalStorageKey);
        console.log(username + " has changed their password.");
        res.status(200).json({ success: true, message: newLocalStorageKey });
    } else {
        console.log("invalid password")
        res.status(400).json({ success: false, message: "Invalid password" });
    }
})

// -------------------------------- USER DATA ----------------------------------------
// need to figure out how to invalidate old tokens server side

// get data
app.get("/api/data", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    const data = await db.getUserData(verification.message);
    res.status(200).json({ success: true, data: data });
})

// update data
app.put("/api/data", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    let data = "";
    try {
        data = req.body.data;
    } catch (err) {
        res.status(400).json({ success: false, message: "Request body missing data", isTokenError: false });
        return;
    }

    await db.updateUserData(verification.message, data)
    res.status(200).json({ success: true, message: "Data updated successfully"});
})

// -------------------------------- USER SETTINGS ----------------------------------------------

// get settings
app.get("/api/settings", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    const settings = await db.getUserSettings(verification.message);
    
    if (!settings) {
        res.status(200).json({ success: true, settings: {} });
        return;
    }

    res.status(200).json({ success: true, settings: settings });
})

// update settings
app.put("/api/settings", async (req, res) => {
    const verification = auth.verifyRequestToken(req);
    if (!verification.success) {
        res.status(400).json({ success: false, message: verification.message, isTokenError: true });
        return;
    }

    let settings = {};
    try {
        settings = req.body.settings;
        if (settings === undefined) throw new Error("Request body missing data")
    } catch (err) {
        res.status(400).json({ success: false, message: "Request body missing data", isTokenError: false });
        return;
    }


    await db.updateUserSettings(verification.message, settings)
    res.status(200).json({ success: true, message: "Data updated successfully" });
})


// listen
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})
app.use(express.static('dist'));

