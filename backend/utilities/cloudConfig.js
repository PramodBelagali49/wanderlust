const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Configure storage for different purposes
const storage = {
    listings: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'wanderlust/listings',
            allowedFormats: ["jpg","jpeg","png","webp","avif"],
            transformation: [{ width: 800, height: 500, crop: 'limit' }]
        }
    }),
    profiles: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'wanderlust/profiles',
            allowedFormats: ["jpg","jpeg","png","webp","avif"],
            transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }]
        }
    })
};

module.exports = { cloudinary, storage }
