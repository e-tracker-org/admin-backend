import request from 'umi-request';
import { API_URL, USER_TOKEN } from '../config/config';

export async function notifyTenant(body, tenantId, landlord) {
    return request(`${API_URL}/notify-tenant/notify`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            Authorization: USER_TOKEN,
        },
        body: JSON.stringify(body),
    });
}
