import CryptoJS from 'crypto-js';
import apiClient from './api-client';
import getSalt from "./getSalt";
import { encryptData, generateDataKey, setDataKey } from './data';
import Cookies from 'js-cookie';
import { Habit } from '../HabitProvider';

// Current user for http. Use user from App.tsx for rendering.
let currentUser = "";

export const initUser = () => {
    try {
        const userCookie = Cookies.get('_auth_state');
        currentUser = userCookie !== undefined ? JSON.parse(userCookie).username : "";
    } catch (err) {
        currentUser = "";
        console.log("Could not parse auth state cookie.", err)
    }
    
}
export const switchUser = (user: string) => {
    currentUser = user;
}

// attempts to log in using the username and password, not for token logins
// server creates temporary token
// returns { success: true, message: "some success message" } on success
//         { success: false, message: "Error message" } on fail
export const login = async (username: string, password: string, signIn: ({ }) => void, salt?: string) => {
    switchUser(username);

    try {
        // get salt if needed
        if (!salt) {
            try {
                salt = await getSalt(username);
            } catch (err) {
                return { success: false, message: "User does not exist" };
            }
        }

        const passwordHash = CryptoJS.SHA256(password + salt).toString();

        let response;
        try {
            // post login and create auth cookie
            response = await apiClient.post("/login", { username, passwordHash })
            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { username }
            })
        } catch (err) {
            return { success: false, message: "Username or password is incorrect"};
        }

        // set data key
        const localKeyResponse = await getLocalStorageKey("Bearer " + response.data.token);
        if (localKeyResponse.success) {
            const localStorageKey = localKeyResponse.message;
            setDataKey(generateDataKey(password, salt!), localStorageKey);
        } else {
            return localKeyResponse;
        }
    } catch (error) {
        return { success: false, message: "Login Error" };
    }
    return { success: true, message: "Login Success" };
}

// attempts to create and login a user
export const createAccount = async (username: string, password: string, signIn: ({ }) => void) => {
    try {
        const existsRes = await apiClient.get("/create/" + username);
        if (existsRes.data.exists)
            return { success: false, message: "User already exists" };

        const salt = existsRes.data.salt

        const passwordHash = CryptoJS.SHA256(password + salt).toString();

        const createRes = await apiClient.post("/create", { username, passwordHash, salt })

        if (!createRes.data.success)
            return { success: false, message: "User already exists" };

        return await login(username, password, signIn, salt);
    } catch (err) {
        return { success: false, message: "Unknown Account Creation Error"};
    }
}

export const deleteAccount = async (authHeader: string) => {
    try {
        const response = (await apiClient.delete("/closeAccount/", {
            headers: {
                'Authorization': authHeader,
                'User': currentUser,
            }
        })).data;
        if (response.success) {
            return { success: true, message: "Account closed successfully" };
        } else {
            return response;
        }
    } catch (err) {
        const tokenError = err.response?.data?.isTokenError === true;
        return { success: false, message: "Unknown Account Deletion Error", isTokenError: tokenError };
    }
}

// gets the user's data from the server
export const fetchData = async (authHeader: string) => {
    try {
        const response = (await apiClient.get("/data/", {
            headers: {
                'Authorization': authHeader,
                'User': currentUser,
            }
        })).data;
        if (!response) return { success: false, message: "No response from server" }
        return response; // { success: bool, message/data: string }
    } catch (err) {
        const tokenError = err.response?.data?.isTokenError === true;
        return { success: false, message: "Error fetching data", isTokenError: tokenError};
    }
}

// update the server with the new user data
export const updateServerData = async (data: string, authHeader: string) => {
    try {
        const response = (await apiClient.put("/data/", {
            data: data,
        }, {
            headers: {
                'Authorization': authHeader,
                'User': currentUser,
            }
        })).data;
        return response; // { success: bool, message: string }
    } catch (err) {
        const tokenError = err.response?.data?.isTokenError === true;
        return { success: false, message: "Error updating data", isTokenError: tokenError };
    }
}

export const getLocalStorageKey = async (authHeader: string) => {
    try {
        const response = (await apiClient.get("/local/", {
            headers: {
                'Authorization': authHeader,
                'User': currentUser,
            }
        })).data;
        if (!response) return { success: false, message: "No response from server" }
        return response; // { success: bool, message: key/err }
    } catch (err) {
        const tokenError = err.response?.data?.isTokenError === true;
        return { success: false, message: "Error fetching local key", isTokenError: tokenError };
    }
}

export const changePassword = async (currentPassword: string, newPassword: string, data: Habit[]) => {
    // hash currentPassword
    let currentSalt;
    try {
        currentSalt = await getSalt(currentUser);
    } catch (err) {
        return { success: false, message: "Failed to fetch salt" };
    }
    const currentPasswordHash = CryptoJS.SHA256(currentPassword + currentSalt).toString();

    // generate new salt
    const newSalt = generateSalt();

    // hash new password
    const newPasswordHash = CryptoJS.SHA256(newPassword + newSalt).toString();

    // create new data key
    const newDataKey = generateDataKey(newPassword, newSalt);
    
    
    // encrypt data with new key
    const newData = encryptData(data, newDataKey);

    // send username, old password hash, salt, new password hash, encrypted data
    let response;
    try {
        response = (await apiClient.post("/changepassword", { username: currentUser, currentPasswordHash, newPasswordHash, salt: newSalt, data: newData })).data;

        if (response.success) {
            // store new data key
            const newLocalStorageKey = response.message;
            setDataKey(newDataKey, newLocalStorageKey);
            return { success: true, message: "Password changed successfully" }
        } else {
            return { success: false, message: "Failed to change Password" }
        }
    } catch (err) {
        return { success: false, message: "Failed to change Password"}
    }
}

const generateSalt = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < 16; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
