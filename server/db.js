const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/habitsite')
    .then(() => console.log('Connected to database...'))
    .catch(err => console.log('Could not connect to database', err));

const userAuthSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    localStorageKey: {
        type: String,
    }
});
const UserAuth = mongoose.model("UserAuth", userAuthSchema);

const userDataSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    user: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    settings: {
        type: {},
    }
});
const UserData = mongoose.model("UserData", userDataSchema);

// --------------------------------------------------- GET ----------------------------------------

async function checkUserExists(username) {
    const user = await UserAuth
        .find({ username: username })
        .select({ username: 1 })
    if (user[0]) {
        return true;
    } else {
        return false;
    }
}

async function getUserData(username) {
    const data = await UserData
        .find({ user: username })
        .select({ data: 1 });
    if (data[0]) {
        return data;
    } else {
        return "";
    }
}

async function getUserSalt(username) {
    const user = await UserAuth
        .find({ username: username })
        .select({ salt: 1 })
        .lean();
    
    if (user[0]?.salt) {
        return user[0].salt;
    } else {
        return undefined;
    }
}

async function getUserLocalStorageKey(username) {
    const user = await UserAuth
        .find({ username: username })
        .select({ localStorageKey: 1 })
        .lean();
    if (user[0]?.localStorageKey) {
        return user[0].localStorageKey;
    } else {
        return undefined;
    }
}

async function getUserSettings(username) {
    const user = await UserData
        .find({ user: username })
        .select({ settings: 1 })
        .lean();
    if (user[0]?.settings) {
        return user[0].settings;
    } else {
        return undefined;
    }
}

// -------------------------------------------------- CREATE ---------------------------------------

async function createNewUser(username, passwordHash, salt, localStorageKey) {
    const user = new UserAuth({
        username: username,
        passwordHash: passwordHash,
        salt: salt,
        localStorageKey: localStorageKey,
    });

    return await user.save();
}

async function createNewUserData(username) {
    const data = new UserData({
        user: username,
        data: " ",
    });

    return await data.save();
}

// -------------------------------------------------- UPDATE ---------------------------------------

async function updateUserData(username, data) {
    return await UserData.updateOne({ user: username }, { data: data });
}

async function updateUserPasswordHash(username, hash) {
    return await UserAuth.updateOne({ username: username }, { passwordHash: hash });
}

async function updateUserLocalStorageKey(username, key) {
    return await UserAuth.updateOne({ username: username }, { localStorageKey: key });
}

async function updateUserSalt(username, salt) {
    return await UserAuth.updateOne({ username: username }, { salt: salt });
}

async function updateUserSettings(username, settings) {
    return await UserData.updateOne({ user: username }, { $set: { settings: settings } });
}

// -------------------------------------------------- DELETE ---------------------------------------

async function deleteAccount(username) {
    const auth = await UserAuth.findOneAndDelete({ username: username });
    const data = await UserData.findOneAndDelete({ user: username });
    if (!auth && !data) {
        return false;
    } else {
        return true;
    }
}

// -------------------------------------------------- CHECK ----------------------------------------

async function verifyHash(username, hash) {
    const user = await UserAuth
        .find({ username: username })
        .select({ passwordHash: 1 })
        .lean();
    if (!user[0]?.passwordHash) return false;
    return user[0].passwordHash === hash;
}

module.exports = {
    checkUserExists,
    getUserData,
    getUserSalt,
    getUserLocalStorageKey,
    getUserSettings,
    createNewUser,
    createNewUserData,
    updateUserData,
    updateUserPasswordHash,
    updateUserLocalStorageKey,
    updateUserSalt,
    updateUserSettings,
    deleteAccount,
    verifyHash,
}