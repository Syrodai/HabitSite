import CryptoJS from 'crypto-js';
import apiClient from './api-client';
import getSalt from "./getSalt";
import { currentUser } from '../App';
import { setDataKey } from './data';

// attempts to log in using the username and password
// server creates temporary token
// returns { success: true, message: "some success message" } on success
//         { success: false, message: "Error message" } on fail
export const login = async (username: string, password: string, signIn: ({ }) => void, salt?: string) => {
    try {
        if (!salt) {
            try {
                salt = await getSalt(username);
            } catch (err) {
                return { success: false, message: "User does not exist" };
            }
        }

        //setDataKey(password, salt!);
        const passwordHash = CryptoJS.SHA256(password + salt).toString();

        try {
            const response = await apiClient.post("/login", { username, passwordHash })
            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { username }
            })
        } catch (err) {
            return { success: false, message: "Username or password is incorrect"};
        }
    } catch (error) {
        return { success: false, message: "Unknown Login Error" };
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
        return { success: false, message: "Unknown error fetching data" };
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
