import express from 'express'
import { resendOTPVerification, sendFeedback ,sendOTPVerification, verifyOTP } from "../controllers/OTPVerification.js"
// import auth from '../middlewares/auth.js';

const router = express.Router();
// console.log("router")
router.post('/sendOTPVerification',  sendOTPVerification)
router.post('/resendOTPVerification',  resendOTPVerification)
router.patch('/verifyOTP',  verifyOTP)
router.post('/send-feedback', sendFeedback)


export default router