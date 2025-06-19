import request from 'umi-request';
import { API_URL, USER_TOKEN } from '../config/config';

export async function getAllGeneralProperties() {
    return request(`${API_URL}/general-properties`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            Authorization: USER_TOKEN,
        },
    });
}
