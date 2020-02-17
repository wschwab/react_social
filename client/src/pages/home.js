import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

import Post from '../components/Post'

const Home = () => {
    const [state, setState] = useState({ posts: [] })

    useEffect(() => {
        axios.get('/posts')
            .then(res => {
                 setState({
                     posts: res.data
                 })
             })
             .catch(err => {
                 console.error(err)
             })
    }, [])

    let recentPostsMarkup = state.posts ? (state.posts.map(post => <Post key={post.postId} post={post}/>))
         : <p>Loading...</p>

    return (
        <Grid container spacing={10}>
            <Grid item sm={8} xs={12}>
                {recentPostsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <p>Profile...</p>
            </Grid>
        </Grid>
    )
}

export default Home
