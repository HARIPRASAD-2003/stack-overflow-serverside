import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/users.js'
import questionRoutes from './routes/questions.js'
import answerRoutes from "./routes/Answers.js"
import postRouter from './routes/posts.js'
import commentRouter from './routes/comments.js'
import VerificationRouter from './routes/OTPVerification.js'
import ChatBotRouter from './routes/ChatBot.js'

const app = express();
dotenv.config()
app.use(express.json({limit: '30mb', extended: true}))
app.use(express.urlencoded({limit: '30mb', extended: true}))
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is a stack overflow clone API")
})

app.use('/user', userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)
app.use('/community', postRouter)
app.use('/comment', commentRouter)
app.use('/verification', VerificationRouter)
app.use('/ChatBot', ChatBotRouter)

const PORT = process.env.PORT || 5000

const connection_url = process.env.CONNECTION_URL

mongoose.connect(connection_url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))