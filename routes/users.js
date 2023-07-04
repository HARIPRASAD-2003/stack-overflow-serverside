import express  from "express";

import { login, signup } from "../controllers/auth.js";
import { getAllUsers, updateProfile, addFriend } from "../controllers/Users.js";
import auth from "../middlewares/auth.js";
import { createPayment, updatePayment, getSubscriptionStatus } from "../controllers/Subscription.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)

router.get('/getAllUsers', getAllUsers)
router.patch('/update/:id', auth, updateProfile)

router.patch('/addFriend/:id', auth, addFriend)

router.get("/getSubscriptionStatus/:id", auth, getSubscriptionStatus)
router.post("/CreatePayment", createPayment)
router.post("/updatePayment/:id", auth, updatePayment)

export default router;