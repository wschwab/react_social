const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const config = {
    apiKey: "AIzaSyC5HD7k8Z-qobxB2Dtu7oDJsofW93xTYx0",
    authDomain: "reactsocial-dfbaf.firebaseapp.com",
    databaseURL: "https://reactsocial-dfbaf.firebaseio.com",
    projectId: "reactsocial-dfbaf",
    storageBucket: "reactsocial-dfbaf.appspot.com",
    messagingSenderId: "606600039073",
    appId: "1:606600039073:web:c2fb889ea1324016497ee0"
  };

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/posts', (req, res) => {
    db
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
    })
    .catch(err => console.error(err));
})

app.post('/post', (req, res) => {
        const newPost = {
            body: req.body.body,
            user: req.body.userHandle,
            createdAt: new Date().toISOString()
        };

        db
            .collection('posts')
            .add(newPost)
            .then(doc => {
                res.json({ message: `document ${doc.id} created successfully` });
            })
            .catch(err =>{
                res.status(500).json({ error: 'something went wrong' });
                console.error(err);
            });
});

const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = string => {
    if(string.trim() === '') return true;
    else return false;
}

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = "Email field required";
    } else if(!isEmail(newUser.email)) {
        errors.email = "Must be a valid email address";
    }

    if(isEmpty(newUser.password)) errors.password = "Password field required";
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if(isEmpty(newUser.handle)) errors.handle = "Handle field required";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken' })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already registered' });
            } else {
                return res.status(500).json({ error: err.code });
            }
        });

});

exports.api = functions.region('europe-west1').https.onRequest(app);
