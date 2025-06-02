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
    folder: 'wanderwise_dev_listings',  // default folder based on type
    resource_type: 'image',
    overwrite: true,  // Always include overwrite in signature
    ...params
  };
  
  // Sort the parameters alphabetically
  const sortedParams = Object.keys(defaultParams)
    .sort()
    .reduce((acc, key) => {
      // Skip api_key and cloud_name as they are not used in signature
      if (key !== 'api_key' && key !== 'cloud_name') {
        acc[key] = defaultParams[key];
      }
      return acc;
    }, {});
  
  // Create the string to sign in format 'key=value&key2=value2...'
  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  console.log('String to sign:', stringToSign);
  
  // Generate the signature using SHA-1
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + process.env.CLOUD_API_SECRET)
    .digest('hex');
  
  console.log('Generated signature:', signature);
    // Return signature and related data  // Return exact parameters that were signed, plus API credentials
  return {
    ...sortedParams,  // Include all parameters that were used in signature
    signature,
    api_key: process.env.CLOUD_API_KEY,
    cloud_name: process.env.CLOUD_NAME
  };
};

module.exports = {
  generateSignature
}; 