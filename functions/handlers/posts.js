const { db } = require('../util/admin');

exports.getAllPosts = (req, res) => {
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
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
};

exports.postOne = (req, res) => {
    if(req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body cannot be empty'})
    }

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('posts')
        .add(newPost)
        .then(doc => {
            const returnPost = newPost;
            returnPost.postId = doc.id;
            res.json(returnPost);
        })
        .catch(err =>{
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
};

exports.getPost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found' });
            }
            postData = doc.data();
            postData.postId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc').where('postId', "==", req.params.postId).get();
        })
        .then(data => {
            postData.comments = [];
            data.forEach(doc => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.comment = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ error: 'Comment is empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Parent post does not exist' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        })
}

exports.like = (req, res) => {
    const likeDoc = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId)
        .limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    let postData;
    postDoc.get()
        .then(doc => {
            if(doc.exists){
                postData = doc.data();
                postData.id = doc.id;
                return likeDoc.get()
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    postId: req.params.postId,
                    userHandle: req.user.handle
                })
                // since non-empty could pass through, nest then()
                .then(() => {
                    postData.likeCount++
                    return postDoc.update({ likeCount: postData.likeCount });
                })
                .then(() => {
                    return res.json(postData);
                })
            } else {
                return res.status(400).json({ error: 'User already liked post' })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.unlike = (req, res) => {
    const likeDoc = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId)
        .limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    let postData;
    postDoc.get()
        .then(doc => {
            if(doc.exists){
                postData = doc.data();
                postData.id = doc.id;
                return likeDoc.get()
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({ error: 'Post not liked: cannot unlike' });
            } else {
                return db.doc(`/likes/${data.docs[0].data().id}`).delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDoc.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            };
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found' });
            }
            if(doc.data().userHandle !== req.user.handle){
                res.status(403).json({ error: 'Unauthorized'});
            } else {
                return document.delete();
            };
        })
        .then(() => {
            res.json({ message: 'Post successfully deleted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}
