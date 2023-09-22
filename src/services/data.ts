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

// create data key based on password, salt
export const generateDataKey = (password: string, salt: string) => {
    const key = CryptoJS.SHA256(password + salt + "dataKey").toString();
    return key;
}

// set data key
export const setDataKey = (key: string, localStorageKey: string) => {
    const iv = CryptoJS.enc.Utf8.parse('iv');
    const encryptedDataKey = CryptoJS.AES.encrypt(key, localStorageKey, { iv: iv }).toString();
    dataKey = key;
    localStorage.setItem('dataKey', encryptedDataKey);
}

export const loadDataKey = (localStorageKey: string) => {
    const encryptedDataKey = localStorage.getItem('dataKey');
    const iv = CryptoJS.enc.Utf8.parse('iv');
    dataKey = CryptoJS.AES.decrypt(encryptedDataKey!, localStorageKey, { iv: iv }).toString(CryptoJS.enc.Utf8);
}

export const encryptData = (data: Habit[], key?: string) => {
    if (!dataKey) {
        throw new Error('dataKey is not set');
    } else {
        const dataString = JSON.stringify(data);
        if(key === undefined) key = dataKey;
        const iv = CryptoJS.enc.Utf8.parse("iv");
        return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(dataString), key, { iv: iv }).toString();
    }
}

export const decryptData = (data: string) => {
    if (!dataKey) {
        throw new Error('dataKey is not set');
    } else {
        const key = dataKey;
        const iv = CryptoJS.enc.Utf8.parse("iv");
        const decryptedString = CryptoJS.AES.decrypt(data, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    }
}