import mongoose from 'mongoose'

const OTPVerification = mongoose.Schema({
    userId: {type: String},
    otp: {type: String},
    createdAt: {type: Date},
    expiresAt: {type: Date}
})

export default mongoose.model("OTPVerification", OTPVerification)