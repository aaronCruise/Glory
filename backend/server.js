const express = require('express');
const path = require('path'); // Required to work with file paths

const app = express();
const port = 8080;

// Serve static files from the 'frontend' folder (outside of the 'backend' folder)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Route root ('/') to serve the login page located in 'frontend/login_without_user_logged_in'
app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '..', 'frontend', 'login_without_user_logged_in', 'index.html');
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


