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
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().user,
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
        return db.doc(`/posts/${snapshot.data().postId}`).get()
        .then(doc => {
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().user,
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

exports.onImageChange = functions.region('europe-west1').firestore.document('/users/{userId}')
    .onUpdate(change => {
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            let batch = db.batch();
            console.log()
            return db.collection('posts').where('user', '==', change.before.data().handle).get()
                .then(data => {
                    data.forEach(doc => {
                        const post = db.doc(`/posts/${doc.id}`);
                        batch.update(post, { userImage: change.after.data().imageUrl });
                    })
                    return batch.commit();
                })
        } else return true;
    })

exports.onPostDelete = functions.region('europe-west1').firestore.document('/posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db.collection('comments').where('postId', '==', postId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('postId', '==', postId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('postId', '==', postId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => console.error(err));
    });
