// --------------------------------------------------
// creating a server using Express.js
// --------------------------------------------------
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path')
// FIX: Use __dirname to serve images correctly
app.use('/images', express.static(path.join(__dirname, 'images')))
// importing post routes
const postRoutes = require('./routes/postRouter')
// importing user routes
const UserRoutes = require('./routes/userRouter')
// connecting mongoDB
console.log("in be")

const mongoose = require('mongoose');
const mongodb = require('mongodb');

const mongodb_URI = 'mongodb+srv://sakshipingle603:sakshi603@awscluster.wqpjelm.mongodb.net/mean-learning';
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
let httpServer = http.createServer(app);

// using post route
app.use(postRoutes)
// using user route
app.use(UserRoutes);


// Connecting to MongoDB
mongoose.connect( mongodb_URI, {
}).then(() => {
  console.log('Connected to MongoDB successfully');
}
).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = app;