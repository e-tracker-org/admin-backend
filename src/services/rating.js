import request from 'umi-request';
import { API_URL, USER_TOKEN } from '../config/config';

export async function createRating(data) {
    try {
        const response = await request(`${API_URL}/tenant-rating/ratings`, {
            method: 'post',
            data,
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return response;
    } catch (error) {
        console.error('Error creating rating:', error);
        throw new Error('Error creating rating');
    }
}

export async function getTenantRating(tenantId) {
    try {
        const response = await request(
            `${API_URL}/tenant-rating/ratings/${tenantId}`,
            {
                method: 'get',
                headers: {
                    Authorization: USER_TOKEN,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error getting tenant rating:', error);
        throw new Error('Error getting tenant rating');
    }
}
