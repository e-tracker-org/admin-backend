import request from 'umi-request';
import { API_URL, USER_TOKEN } from '../config/config';


export async function loginUser(credentials) {
  return request(`${API_URL}/auth/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(credentials),
  });
}

export async function updateUserAccountType(body, userId) {
    return request(`${API_URL}/user-profile/update-account-type/${userId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: USER_TOKEN,
        },
        body: JSON.stringify(body),
    });
}

export async function fetchAllUsers() {
    return request(`${API_URL}/user-profile`, {
        method: 'get',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
}

export async function checkSubscription(email) {
    return request(`${API_URL}/payment/subscription/status?email=${encodeURIComponent(email) || email}`, {
        method: 'get',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
    
}

export async function getVerificationRequests(userId) {
    return request(`${API_URL}/payment/verification/requests?userId=${userId}`, {
        method: 'get',
        headers: {
            Authorization: USER_TOKEN,
        },
    });
    
}

export async function fetchAndFilterUsersByAccountType() {
    const allUsersResponse = await fetchAllUsers();
    const filteredUsers = allUsersResponse.filter((user) =>
        // user.accountTypes.includes(1)
        user.currentKyc?.accountType === 1
    );
    return filteredUsers;
}
