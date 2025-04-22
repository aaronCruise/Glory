const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const registerRoute = require('./controllers/registerationController');
const profileRoute = require('./controllers/profileController');
const loginController = require('./controllers/loginController');
const productRoute = require('./controllers/shopController');
const cartRoute = require('./controllers/cartController');

const app = express();
const port = 8080;

// Middleware to handle POST data
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json());  // For handling JSON requests

app.use(cors({
  origin: 'http://128.6.60.9:8080',
  credentials: true
}));

app.use(session({
  secret: 'mySecretString',

  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}));

// Serve product images from backend/images or images_fonts
app.use('/images', express.static(path.join(__dirname, '../images_fonts')));
app.use('/products', productRoute);
// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Route root to login page
app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, '..', 'frontend', 'home_without_user_logged_in', 'index.html');
  console.log('Generated file path:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error serving file:', err);
      res.status(500).send('Error loading the login page.');
    } else {
      console.log(`✅ Successfully served: ${filePath}`);
    }
  });
});

// Page routes
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/registeration/index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/profile_user_logged_in/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login_without_user_logged_in/index.html'));
});

app.get('/UsersHome', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home_user_logged_in/index.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/shop_without_user_logged_in/index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/cart_user_logged_in/index.html'));
});

// Route logic
app.use('/register', registerRoute);
app.use('/profile', profileRoute);
app.use('/login', loginController);
app.use('/products', productRoute);
app.use('/cart', cartRoute);     // ✅ Product API

// Start the server
/*
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
*/

if (require.main === module) {
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}
module.exports = app;
