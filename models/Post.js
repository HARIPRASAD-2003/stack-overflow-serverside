import mongoose from 'mongoose'

const PostSchema = mongoose.Schema({
    postTitle: {type: String, required: "Post must have a Title"},
    postBody: {type: String, required: "Post must have a body"},
    postContent: {type: [String]},
    userPosted: {type: String, required: "Post must have an author"},
    userId: {type: String },
    postedOn: {type: Date, default: Date.now},
    likes: {type: [String], default: []},
    noOfComments: {type: Number, default: 0},
    comments: [{
        commentBody: String,
        userCommented: String,
        userId: String,
        commentedOn: {type: Date, default: Date.now}
    }]
})

export default mongoose.model("Post", PostSchema)