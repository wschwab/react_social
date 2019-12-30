const functions = require('firebase-functions');
const app = require('express')();

const fireAuth = require('./util/fireAuth');

const { db } = require('./util/admin');

const { getAllPosts, postOne, getPost, comment, like, unlike, deletePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserPublicDetails, markNotificationsAsRead } = require('./handlers/users');

// routes for posts
app.get('/posts', getAllPosts);
app.post('/post', fireAuth, postOne);
app.get('/post/:postId', getPost);
app.post('/post/:postId/comment', fireAuth, comment);
app.get('/post/:postId/like', fireAuth, like);
app.get('/post/:postId/unlike', fireAuth, unlike);
app.delete('/post/:postId', fireAuth, deletePost);

// routes for users
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fireAuth, uploadImage);
app.post('/user', fireAuth, addUserDetails);
app.get('/user', fireAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserPublicDetails);
app.post('/notifications', fireAuth, markNotificationsAsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onCreate(snapshot => {
        return db.doc(`/posts/${snapshot.data().postId}`).get()
        .then(doc => {
            if(doc.exists){
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    postId: doc.id
                });
            }
        })
        .catch(err => console.error(err));
    });

exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err => {
                console.error(err);
                return;
            })
    })

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
    .onCreate(snapshot => {
        console.log(db.doc);
        return db.doc(`/posts/${snapshot.data().postId}`).get()
        .then(doc => {
            if(doc.exists){
                console.log(doc);
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    postId: doc.id
                });
            }
        })
        .catch(err => {
            console.error(err);
            return;
        });
    });
