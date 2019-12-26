const functions = require('firebase-functions');
const app = require('express')();

const fireAuth = require('./util/fireAuth');

const { getAllPosts, postOne } = require('./handlers/posts');
const { signup, login, uploadImage } = require('./handlers/users');

// routes for posts
app.get('/posts', getAllPosts);
app.post('/post', fireAuth, postOne);

// routes for users
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fireAuth, uploadImage);

exports.api = functions.region('europe-west1').https.onRequest(app);
