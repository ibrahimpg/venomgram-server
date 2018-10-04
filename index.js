const express = require('express');
const mongoose = require('mongoose');

const app = express();

const UserRoute = require('./api/routes/user');
const PostRoute = require('./api/routes/post');

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.status(200).json({});
  }
  next();
});

app.use('/user', UserRoute);
app.use('/post', PostRoute);

app.use((req, res, next) => {
  const error = new Error('Route not available.');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

const port = process.env.PORT || 8080;

app.listen(port);
