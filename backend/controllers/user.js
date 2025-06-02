const User = require('../models/user.js');
const {
  hashPassword,
} = require('../utilities/passwordUtils.js');
const {AppError, formatResponse} = require('../utilities/errorHandler.js');
const passport = require('passport');
const Listing = require('../models/listing.js');
const crypto = require('crypto');
const { generateToken } = require('../utilities/tokenUtils.js');
const { generateSignature } = require('../utilities/cloudinaryUtils.js');

// User signup
module.exports.signup = async (req, res) => {
  const {email, password, name} = req.body;

  if (!email || !password || !name) {
    throw new AppError('Email, password, and name are required', 422);
  }

  // Check if user already exists
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const newUser = new User({
    email, 
    name, 
    password: hashedPassword,
  });

  // Save user to database
  const savedUser = await newUser.save();

  // Generate JWT token
  const token = generateToken(savedUser);

  // Create user data
  const data = {
    userId: savedUser._id,
    email: savedUser.email,
    name: savedUser.name,
  };

  // Login the user after signup
  req.login(savedUser, (err) => {
    if (err) {
      throw new AppError('Error during login after signup', 500);
    }
    res.status(201).json(formatResponse(true,
      'User registered successfully',
      {
        user: data,
        token,
      },
    ));
  });
};

// User login
module.exports.login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      throw new AppError('Authentication error', 500);
    }
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    req.login(user, (err) => {
      if (err) {
        throw new AppError('Error during login', 500);
      }      const data = {
        userId: user._id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto || '',
      };
      const token = generateToken(user);
      return res.status(200).json(formatResponse(true,
        'Login successful',
        {
          user: data,
          token,
        },
      ));
    });
  })(req, res);
};

// User logout
module.exports.logout = (req, res) => {
  req.logout(() => {
    res.status(200).json(formatResponse(true, 'Logged out successfully', null));
  });
};

// Check if user is logged in
module.exports.isLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(formatResponse(true, 'User is logged in', {
      user: {
        userId: req.user._id,
        email: req.user.email,
        name: req.user.name,
        profilePhoto: req.user.profilePhoto || '',
      },
    }));
  }
  return res.status(401).json(formatResponse(false, 'Not logged in', null));
};

// Get Cloudinary upload signature
module.exports.getCloudinarySignature = async (req, res) => {
  try {
    const type = req.query.type || 'listing';
    const folder = type === 'profile' ? 'wanderlust/profiles' : 'wanderlust/listings';
    
    // Generate a unique public_id
    const timestamp = Date.now();
    const publicId = `${req.user.userId}_${timestamp}`;
    
    const signatureData = generateSignature({ 
      folder,
      public_id: publicId,
      timestamp
    });
    
    res.json(formatResponse(true, 'Signature generated successfully', signatureData));
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    throw new AppError('Failed to generate upload signature', 500);
  }
};

// Get Cloudinary upload credentials
module.exports.getCloudinaryCredentials = async (req, res) => {
  try {
    const type = req.query.type || 'listing';
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new AppError('Cloudinary configuration missing', 500);
    }

    // Generate all necessary credentials including signature
    const credentials = generateSignature({ type });
    
    res.json(formatResponse(true, 'Credentials retrieved successfully', credentials));
  } catch (error) {
    console.error('Error getting Cloudinary credentials:', error);
    throw new AppError('Failed to get upload credentials', 500);
  }
};
