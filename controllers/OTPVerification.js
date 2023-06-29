import OTPVerification from '../models/OTPVerification.js';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: "Harish!!!@))#",
    },
  });


export const sendOTPVerification = async (req,res) => {
    try {
        const {id, email} = req.body
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify with OTP for Stack-OverFlow ChatBot",
            html: `<html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Stack Overflow ChatBot - OTP Verification</h2>
                <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">Dear User,</p>
                <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">Thank you for signing up for the Stack Overflow ChatBot. To complete the verification process and gain access to the ChatBot, please use the following OTP (One-Time Password):</p>
                <div style="background-color: #f8f8f8; padding: 10px 20px; border-radius: 4px; font-size: 20px; color: #333333; display: inline-block;">${otp}</div>
                <p style="font-size: 16px; color: #555555; margin-top: 30px;">Please enter this OTP on the verification page to complete the process. If you did not request this verification, please ignore this email.</p>
                <p style="font-size: 16px; color: #555555; margin-top: 30px;">Thank you for choosing Stack Overflow ChatBot!</p>
                <p style="font-size: 16px; color: #555555;">Best regards,<br>Stack Overflow Team</p>
              </div>
            </body>
            </html>
            `
            // html:`<p>Enter <b>${otp}</b> in the app to verify your identity to access Stack-OverFlow ChatBot</p>
            // <p>This code <b>expires in 10mins</b></p>`
        };

        // console.log(mailOptions)
        const saltRounds = 10;

        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const newOTPVerification = await new OTPVerification({
            
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
            userId: id,
        })

        console.log(newOTPVerification)

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions)

        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: id,
                email: email,
                otp_id: newOTPVerification._id,
            },
        });

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
}

export const verifyOTP = async(req, res) => {
    try {
        console.log("Body:", req.body)
        const {id, otp} = req.body;
        console.log("id:", id, otp)
        // const userId = id;
        if(!id || !otp) {
            throw new Error("Empty otp details are not allowed");
        }else{
            const userOTPVerification = await OTPVerification.find({
                userId: id,
            });
            const userOTPVerifications = userOTPVerification.sort((a,b) => a.createdAt < b.createdAt ? 1 : -1)
            if(userOTPVerifications.length <= 0){
                throw new Error("Account record doesn't exist or has been verified already.");
            }else{
                const {expiresAt} = userOTPVerifications[0];
                const hashedOTP = userOTPVerifications[0].otp;

                if(expiresAt < Date.now()){
                    await OTPVerification.deleteMany({userId: id});
                    throw new Error("Code has been expired. Please request again");
                }else{
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if(!validOTP){
                        throw new Error("Invalid Code!!!, Check your inbox");
                    } else {
                        await OTPVerification.deleteMany({userId: id});
                        res.json({
                            status: 'VERIFIED',
                            message: "user otp verified Successfully",
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

export const resendOTPVerification = async(req, res) => {
    try {
        const {id, email} = req.body;

        if(!id || !email){
            throw new Error("Empty user Details are not allowed");
        } else {
            await OTPVerification.deleteMany({id});
            sendOTPVerification(req, res);
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}