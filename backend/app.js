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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const session = require('express-session');
const MongoStore = require('connect-mongo');

const listingsRoutes = require('./routes/listing.js');
const reviewsRoutes = require('./routes/review.js');
const usersRoutes = require('./routes/user.js');
const port = process.env.PORT || 3000;

// Database connection
main().
  then(() => console.log(`Database Connection successful.`)).
  catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
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

// Improved CORS configuration
const allowedOrigins = [
  process.env.REACT_APP_API_URL || 'http://localhost:5173',
];

if (process.env.REACT_APP_API_URL2) {
  allowedOrigins.push(process.env.REACT_APP_API_URL2);
}

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
      mongoUrl: "mongodb://127.0.0.1:27017/wanderlust",
      collectionName: 'sessions'
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    name: 'sessionId',
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 3600 * 2, // 2 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// API routes
app.get('/', (req, res) => {
  res.redirect('/listings');
});

app.use('/listings/:id/reviews', reviewsRoutes);
app.use('/listings', listingsRoutes);
app.use('/', usersRoutes);

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