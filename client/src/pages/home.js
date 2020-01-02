import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

import Post from '../components/Post'

// class home extends Component {
//     state = {
//         posts: null
//     }
//
//     componentDidMount(){
//         axios.get('/posts')
//             .then(res => {
//                 this.setState({
//                     posts: res.data
//                 })
//             })
//             .catch(err => console.error(err))
//     }
//
//     render() {
//         let recentPostsMarkup = this.state.posts ? (
//             this.state.posts.map(post => <Post key={post.postId} post={post}/>)
//         ) : <p>Loading...</p>
//
//         return (
//             <Grid container spacing={16}>
//                 <Grid item sm={8} xs={12}>
//                     {recentPostsMarkup}
//                 </Grid>
//                 <Grid item sm={4} xs={12}>
//                     <p>Profile...</p>
//                 </Grid>
//             </Grid>
//         )
//     }
// }
//
// export default home

const Home = () => {
    const [state, setState] = useState({})

    useEffect(() => {
        axios.get('/posts')
            .then(res => {
                 console.log(res.data)
                 setState({
                     posts: res.data
                 })
             }, [])
    })

    let recentPostsMarkup = state.posts ? (state.posts.map(post => <Post post={post}/>))
         : <p>Loading...</p>

    return (
        <Grid container spacing={16}>
            <Grid item sm={8} xs={12}>
                <p>{recentPostsMarkup}</p>
            </Grid>
            <Grid item sm={4} xs={12}>
                <p>Profile...</p>
            </Grid>
        </Grid>
    )
}

export default Home
