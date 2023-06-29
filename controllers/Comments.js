import mongoose from "mongoose";
import Post from '../models/Post.js'

export const postComment = async(req, res) => {
    // console.log("postComment")
    const {id: _id} = req.params;
    const { noOfComments, commentBody, userCommented, userId} = req.body;
    // console.log(noOfComments, commentBody, userCommented, userId);

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('post unavailable...')
    }
    updateNoOfComments(_id, noOfComments)
    try {
        const updatedPost = await Post.findByIdAndUpdate( _id, { $addToSet: {'comments': [{commentBody, userCommented, userId }]}})
        // console.log("postComment", updatedPost)
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateNoOfComments = async(_id, noOfComments) => {
    try{
        await Post.findByIdAndUpdate( _id, { $set: { 'noOfComments': noOfComments}})
        // console.log(noOfComments)
    }catch(error){
        console.log(error)
    }
}

export const deleteComment = async( req, res ) => {
    const { id: _id } = req.params;
    const { commentId, noOfComments } = req.body;
    // console.log("req.body", req.body)
    // console.log("noOfComments", noOfComments)

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('post unavailable...')
    }
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(404).send('comment unavailable...')
    }
    updateNoOfComments( _id, noOfComments)
    try{
        await Post.updateOne(
            { _id },
            { $pull: {comments: { _id: commentId } } }
        )
        res.status(200).json({message: "Successfully deleted"})
    }catch(error){
        res.status(405).json(error)
    }
}