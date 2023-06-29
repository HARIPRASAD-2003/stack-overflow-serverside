import express from 'express'
import { getResponse } from '../controllers/ChatBot.js';



const router = express.Router();
// console.log("router")
router.post('/post', getResponse)

export default router