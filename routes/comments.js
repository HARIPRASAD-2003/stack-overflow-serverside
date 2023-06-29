import express from 'express'
import { postComment, deleteComment } from "../controllers/Comments.js"
import auth from '../middlewares/auth.js';

const router = express.Router();
// console.log("router")
router.patch('/post/:id', auth, postComment)
router.patch('/delete/:id', auth, deleteComment)

export default router