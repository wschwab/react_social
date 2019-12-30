let db = {
    users: [
        {
            userId: 'T4atHpfeMRVfZZX7sRIAzP3YXtj1',
            email: 'user@example.com',
            handle: 'user',
            createdAt: '2019-12-26T19:44:41.127Z', // ISO string
            imageUrl: 'image/gobblygook/gobbly',
            bio: 'Hi, I AM THE USER',
            website: 'https://example.com',
            location: 'Tana, MG'
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'this is the post body',
            createdAt: "2019-12-24T19:52:43.841Z",
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            postId: '',
            body: 'This is a comment, bro',
            createdAt: '2019-12-26T19:44:41.127Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'num2',
            read: 'true | false',
            postId: 'Wd88sJyXJM5zTGCaDRbS',
            type: 'like | comment',
            createdAt: '2019-12-26T19:44:41.127Z'
        }
    ]
}

const userDetails = {
    // Redux
    credentials: {
        userId: '',
        email: 'user@example.com',
        handle: 'user',
        createdAt: '2019-12-26T19:44:41.127Z',
        imageUrl: 'image/gobblygook/gobbly',
        bio: 'Hi, I AM THE USER',
        website: 'https://example.com',
        location: 'Tana, MG'
    },
    likes: [
        {
            userHandle: 'user',
            postId: ''
        },
        {
            userHandle: 'user',
            postId: ''
        }
    ]
}
