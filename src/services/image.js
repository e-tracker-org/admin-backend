import request from 'umi-request';
import axios from 'axios';
import { API_URL, USER_TOKEN } from '../config/config';

// Function to upload an image
export async function uploadImage(formData) {
    try {
        const response = await axios.post(
            `${API_URL}/images/upload-image`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error uploading image');
    }
}
