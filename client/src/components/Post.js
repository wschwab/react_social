import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Link from 'react-router-dom/Link'

// Material UI
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

const Post = (props) => {
    const { classes, post : { body, createdAt, userImage, user, postId, likeCount, commentCount }} = props
    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile image" className={classes.image} />
            <CardContent class={classes.content}>
                <Typography variant="h5" component={Link} to={`/users/${user}`} color="primary">{user}</Typography>
                <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
                <Typography variant="body1">{body}</Typography>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(Post)
