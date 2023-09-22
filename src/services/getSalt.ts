import apiClient from './api-client';

const getSalt = async (username: string) => {
    try {
        const salt = await apiClient.get('/salt/' + username);
        return salt.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export default getSalt;