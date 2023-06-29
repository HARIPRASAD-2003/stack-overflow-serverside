import Post from '../models/Post.js'
import mongoose from 'mongoose';

export const NewPost = async (req, res) => {
    const newPostData = req.body;
    const newPost = new Post(newPostData);
    console.log("NEW POST:", newPost);
    try{
        await newPost.save();
        res.status(200).json("added a post Successfully");
   }catch(error){
    console.log(error.message);
    res.status(409).json("Couldn't add a new post");
   }
}

export const getAllPosts = async(req, res) => {
    try{
        const PostList = await Post.find();
        // console.log(PostList)
        res.status(200).json(PostList);
    }catch(error){
        res.status(404).json(error);
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    const { id:_id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('post unavailable...')
    }

    try {
        await Post.findByIdAndRemove(_id);
        res.status(200).json({message: "Successfully deleted"});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const LikePost = async(req, res) => {
    const {id: _id} = req.params
    const {userId} = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('post unavailable...')
    }

    try {
        const post = await Post.findById(_id)
        const likeIndex = post.likes.findIndex((id) => id === String(userId))
        if(likeIndex !== -1){
            post.likes = post.likes.filter((id) => id !== String(userId))
        }else{
            post.likes.push(String(userId))
            console.log("Liked")
        }

        await Post.findByIdAndUpdate( _id, post)
        res.status(200).json({message: 'Liked Successfully'})

    } catch (error) {
        res.status(408).json({message: error.message})
    }
}