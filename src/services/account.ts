import CryptoJS from 'crypto-js';
import apiClient from './api-client';
import getSalt from "./getSalt";
import { setDataKey } from './data';
import Cookies from 'js-cookie';

// current user. Use user from App.tsx for rendering.

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
            setDataKey(password, salt!, localStorageKey);
        } else {
            return { success: false, message: localKeyResponse.message };
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
            return { success: false, message: response.message };
        }
    } catch (err) {
        return { success: false, message: "Unknown Account Deletion Error" };
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
        console.log(err);
        return { success: false, message: "Error fetching data" };
    }
}

// update the server with the new user data
export const updateServerData = async (data: string, authHeader: string) => {
    try {
        const response = await apiClient.put("/data/", {
            data: data,
        }, {
            headers: {
                'Authorization': authHeader,
                'User': currentUser,
            }
        });
        return response; // { success: bool, message: string }
    } catch (err) {
        return { success: false, message: "Error updating data" };
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
        return { success: false, message: "Error fetching local key" };
    }
}

export const changePassword = async (currentPassword: string) => {
    currentPassword 
}
