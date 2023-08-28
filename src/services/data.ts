import CryptoJS from 'crypto-js';
import { Habit } from '../HabitProvider';

/*
 *  All data is encrypted on the server using a hash
 *  of the user's password, salt, and constant string as the key.
 *  If the user resets their password, all data will need to
 *  be reencrypted by them using the new key.
 *  If the password is forgotten, the data is effectively lost.
*/

export let dataKey = "";

export const setDataKey = (password: string, salt: string, localStorageKey: string) => {
    dataKey = CryptoJS.SHA256(password + salt + "dataKey").toString();
    const iv = CryptoJS.enc.Utf8.parse('iv');
    const encryptedDataKey = CryptoJS.AES.encrypt(dataKey, localStorageKey, { iv: iv }).toString();
    localStorage.setItem('dataKey', encryptedDataKey);
}

export const loadDataKey = (localStorageKey: string) => {
    const encryptedDataKey = localStorage.getItem('dataKey');
    const iv = CryptoJS.enc.Utf8.parse('iv');
    dataKey = CryptoJS.AES.decrypt(encryptedDataKey, localStorageKey, { iv: iv }).toString(CryptoJS.enc.Utf8);
}

export const encryptData = (data: Habit[]) => {
    if (!dataKey) {
        throw new Error('dataKey is not set');
    } else {
        const dataString = JSON.stringify(data);
        const key = dataKey;
        const iv = "iv";
        return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(dataString), key, { iv: iv }).toString();
    }
}

export const decryptData = (data: string) => {
    if (!dataKey) {
        throw new Error('dataKey is not set');
    } else {
        const key = dataKey;
        const iv = "iv";
        const decryptedString = CryptoJS.AES.decrypt(data, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    }
}