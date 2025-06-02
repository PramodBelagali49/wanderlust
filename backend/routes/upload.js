const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn } = require('../utilities/middleware.js');
const { uploadImage, cloudinary } = require('../utilities/cloudConfig.js');
const { formatResponse } = require('../utilities/errorHandler.js');

// Test route to verify Cloudinary configuration
router.get('/test-config', isLoggedIn, (req, res) => {
    try {
        const config = cloudinary.config();
        res.json(formatResponse(true, 'Cloudinary configuration loaded', {
            cloud_name: config.cloud_name,
            api_key: config.api_key ? 'Present' : 'Missing',
            api_secret: config.api_secret ? 'Present' : 'Missing'
        }));
    } catch (error) {
        res.status(500).json(formatResponse(false, 'Failed to load Cloudinary configuration'));
    }
});

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Handle image upload
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(formatResponse(false, 'No image file provided'));
        }

        // Convert buffer to base64
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Determine folder based on upload type
        const folder = req.query.type === 'profile' ? 'wanderlust/profiles' : 'wanderlust/listings';
        
        // Upload to Cloudinary
        const uploadResult = await uploadImage(fileStr, folder);

        res.json(formatResponse(true, 'Image uploaded successfully', {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        }));
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json(formatResponse(false, error.message || 'Failed to upload image'));
    }
});

module.exports = router; 