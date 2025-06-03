require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const {formatResponse} = require('./utilities/errorHandler');
const { validatePassword } = require('./utilities/passwordUtils');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const listingsRoutes = require('./routes/listing.js');
const reviewsRoutes = require('./routes/review.js');
const usersRoutes = require('./routes/user.js');
const uploadRoutes = require('./routes/upload.js');
const port = process.env.PORT || 3000;

// Database connection
main().
  then(() => console.log(`Database Connection successful.`)).
  catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
}

// Passport configuration
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({email});
    if (!user) {
      return done(null, false, {message: 'Invalid credentials'});
    }
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, {message: 'Invalid credentials'});
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(express.json());
app.set('trust proxy', 1);
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
    crossOriginOpenerPolicy: {
      policy: 'unsafe-none',
    },
  }),
);

// CORS configuration
const allowedOrigins = [
  'https://wanderlust-frontend-8a4h.onrender.com',
  'http://localhost:5173', // keeping localhost for development
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions'
    }),
    resave: false,
    saveUninitialized: false,    secret: process.env.JWT_SECRET || 'your-fallback-secret-key',
    name: 'sessionId',
    proxy: true,    cookie: {
      secure: true, // Always use secure cookies
      maxAge: 1000 * 3600 * 2, // 2 hours
      sameSite: 'none', // Required for cross-site requests
      httpOnly: true,
      domain: '.onrender.com' // Allow cookies for all subdomains of onrender.com
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// API routes
// Mount routes in correct order
app.use('/listings', listingsRoutes);
app.use('/listings/:id/reviews', reviewsRoutes);
app.use('/upload', uploadRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res) => {
  res.redirect('/listings');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(formatResponse(false, 'Route not found'));
});

app.use((err, req, res) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json(formatResponse(false, message));
});

app.listen(port, () => console.log(`Listening on port ${port}`));