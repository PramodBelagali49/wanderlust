const crypto = require('crypto');
require('dotenv').config();

/**
 * Generates a signature for Cloudinary upload based on params and API secret
 * @param {Object} params - Parameters to include in the signature
 * @returns {Object} - The generated signature data
 */
const generateSignature = (params = {}) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Add required parameters
  const defaultParams = {
    timestamp,
    folder: 'wanderwise_dev_listings',
    ...params
  };
  
  // Sort the parameters alphabetically and filter out null/undefined values
  const sortedParams = Object.keys(defaultParams)
    .sort()
    .reduce((acc, key) => {
      const value = defaultParams[key];
      // Skip api_key, cloud_name, and null/undefined values
      if (key !== 'api_key' && key !== 'cloud_name' && value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  
  // Create the string to sign
  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  // Generate the signature
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');
  
  // Return all necessary parameters for the upload
  return {
    timestamp,
    signature,
    folder: defaultParams.folder,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
  };
};

module.exports = {
  generateSignature
}; 