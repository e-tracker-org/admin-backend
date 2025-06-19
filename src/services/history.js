import request from 'umi-request';
import { API_URL, USER_TOKEN } from '../config/config';

export async function createHistory(
    userId,
    tenantEmail,
    landlordId,
    propertyId
) {
    try {
        const body = {
            userId: userId,
            tenantEmail: tenantEmail,
            landlordId: landlordId,
            propertyId: propertyId,
        };

        const response = await fetch(`${API_URL}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: USER_TOKEN,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to create history entry');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to create history entry: ' + error.message);
    }
}

export async function findOneHistoryByEmail(email) {
    return request(`${API_URL}/history/${email}`, {
        method: 'GET',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
}

export async function updateHistory(id, body) {
    return request(`${API_URL}/history/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: USER_TOKEN,
        },
        data: body,
    });
}

export async function deleteHistory(id) {
    return request(`${API_URL}/history/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
}

export async function deleteAllHistory() {
    return request(`${API_URL}/history`, {
        method: 'DELETE',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
}
