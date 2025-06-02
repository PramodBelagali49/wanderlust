import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

/**
 * Get Cloudinary upload credentials from backend
 * @returns {Promise<Object>} - The credentials data
 */
export const getCloudinaryCredentials = async (type = 'profile') => {
    try {
        const response = await axiosInstance.get(`/cloudinary-credentials?type=${type}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get Cloudinary credentials');
    }
};

/**
 * Upload an image to Cloudinary directly
 * @param {File} file - The file to upload
 * @param {Object} credentials - The Cloudinary credentials
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadToCloudinary = async (file, credentials) => {
    try {
        if (!file || !credentials) {
            throw new Error('Missing required upload parameters');
        }        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        
        // Add all credentials from backend
        Object.entries(credentials).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        // Upload to Cloudinary
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${credentials.cloud_name}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!response.data.secure_url) {
            throw new Error('Invalid response from Cloudinary');
        }

        // Validate the returned URL format
        try {
            new URL(response.data.secure_url);
        } catch {
            throw new Error('Invalid image URL returned from Cloudinary');
        }

        return response.data.secure_url;
    } catch (error) {
        if (error.response?.data?.error?.message) {
            throw new Error(`Cloudinary error: ${error.response.data.error.message}`);
        }
        throw new Error(error.message || 'Failed to upload image to Cloudinary');
    }
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @throws {Error} - If validation fails
 */
export const validateImageFile = (file) => {
    // Check if file exists
    if (!file) {
        throw new Error('No file selected');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Selected file is not a supported image type. Please use JPG, PNG, or GIF.');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        throw new Error('Selected file is too large. Please choose an image under 5MB.');
    }

    return true;
};