import express from 'express'

import { LikePost, NewPost, deletePost, getAllPosts, } from "../controllers/posts.js"
import auth from '../middlewares/auth.js'

const router = express.Router()

router.post("/new-post", auth, NewPost)
router.get("/get", getAllPosts)
router.delete('/delete/:id', auth, deletePost);
router.patch('/like/:id', auth, LikePost);

export default router