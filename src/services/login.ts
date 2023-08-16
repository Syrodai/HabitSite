import CryptoJS from 'crypto-js';
import apiClient from './api-client';
import getSalt from "./getSalt";

const login = async (username: string, password: string, signIn: ({ }) => void) => {
    try {
        let salt;
        try {
            salt = await getSalt(username);
        } catch (err) {
            return { success: false, message: "User does not exist" };
        }

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

export default login;