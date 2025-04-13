
const express = require('express');
const loginController = require('./controllers/loginController');
const path = require('path'); // Required to work with file paths
const db = require('./db')
const app = express()
const port = 8080
const cors = require('cors');
const bodyParser = require("body-parser");
const session = require('express-session');
const registerRoute = require('./controllers/registerationController');
const profileRoute = require('./controllers/profileController');


// Middleware to handle POST data
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json());  // For handling JSON requests
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// Serve static files from the 'images_fonts' folder (outside of the 'backend' folder)
//app.use(express.static(path.join(__dirname, '..', 'images_fonts')));

app.use(session({
  secret: 'mySecretString',
  resave: false,
  saveUninitialized: true,
  cookie: {
        httpOnly: true,
        secure: false, // set to true in production if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use('/images', express.static(path.join(__dirname, '../images_fonts')));

// Serve static files from the 'frontend' folder (outside of the 'backend' folder)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Route root ('/') to serve the login page located in 'frontend/home_without_user_logged_in'
app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '..', 'frontend', 'home_without_user_logged_in', 'index.html');
console.log('Generated file path:', filePath);
    console.log(`🔹 Request received for '/'`);
    console.log(`🔹 Serving file: ${filePath}`);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('❌ Error serving file:', err);
            res.status(500).send('Error loading the login page.');
        } else {
            console.log(`✅ Successfully served: ${filePath}`);
        }
    });
});


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

app.use('/register', registerRoute);

app.use('/profile', profileRoute);

app.use('/login', loginController);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


