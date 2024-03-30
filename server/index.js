const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const UserModel = require('./models/DataModel'); // Import your Mongoose model

const app = express();
const PORT = 3000;

// const SERVER_URL = 'http://<ngrok_subdomain>.ngrok.io';

// Middleware
app.use(cors());
require('dotenv').config();
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your_database_uri' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://rexsparsh:sparsh@cluster0.rw8x4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected Successfully');

// Routes
app.get('/', (req, res) => {
    res.json({ message: "hello world" });
    console.log("hello world");
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await UserModel.findOne({ email: email });
            if (user != null) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (user.email === email && isMatch) {
                    //Generate JWT Token
                    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
                    res.json({ "status": "success", "message": "Login Successful", "token": token });
                } else {
                    res.json({ "status": "failed", "message": "Email or password is not valid" });
                }
            } else {
                res.json({ "status": "failed", "message": "You are not a registered user" });
            }
        } else {
            res.json({ "status": "failed", "message": "All fields are required" });
        }
    } catch (error) {
        res.json({ "status": "failed", "message": `Unable to login with error ${error}` });
    }
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
