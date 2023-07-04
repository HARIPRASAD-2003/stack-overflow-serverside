import stripe from 'stripe';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from '../models/auth.js'; // Assuming you have a User model
import Subscription from "../models/Subscription.js";
import Questions from '../models/Questions.js'
dotenv.config();

const stripeInstance = new stripe(process.env.SECRET_KEY);


export const createPayment = async(req, res) => {
    const {plan} = req.body;
    const amt = plan === 'Free' ? 0 : plan === 'Silver' ? 10000 : plan === 'Gold' && 100000;
    const hashPlan = plan === 'Free' ? 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p' : plan === 'Silver' ? 'p6o5n4m3l2-k1j0-i9h8-g7f6-e5d4c3b2a1' : plan === 'Gold' && '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p'
    try {
        const session = await stripeInstance.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: `${plan} Plan`,
                },
                unit_amount: amt,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `https://stack-overflow-prime-hp.netlify.app/Success/${hashPlan}`,
          cancel_url: 'https://stack-overflow-prime-hp.netlify.app/Subscription',
        });

        res.json({ id: session.id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create checkout session' });
      }
}

export const updatePayment = async (req, res) => {
    const {id: _id} = req.params;
    const { plan } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user unavailable...");
      }
    try {
        const existingSubscription = await Subscription.findOne({ userId: _id });
        console.log(existingSubscription)
        if(existingSubscription){
            const updatedSubscription = await Subscription.findByIdAndUpdate(existingSubscription._id ,{ $set: {planId: plan, startDate: Date.now(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} }, { new: true })
            res.status(200).json({updatedSubscription})
        } else {
        const  newSubscription= await new Subscription({
            userId: _id,
            planId: plan,
        })
        console.log(newSubscription);
        await newSubscription.save();
        res.status(200).json({ newSubscription })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create Subscription' })
    }
}

export const getSubscriptionStatus = async (req, res) => {
    const {id: _id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user unavailable...");
    }

    try {
        let status;
        let subscription = null;
        const existingSubscription = await Subscription.findOne({ userId: _id });
        if(existingSubscription){
            const currentDate = new Date();
            if (currentDate >= existingSubscription.startDate && currentDate <= existingSubscription.endDate) {
                // console.log('Subscription is active');
                status = "active";
            } else {
                // console.log('Subscription is expired or not yet started');
                status = "inactive"
            }
            subscription = existingSubscription;
        } else {
            status = "inactive";
        }
        const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    const questionsToday = await Questions.find({
      userId: _id,
      askedOn: { $gte: startOfToday, $lte: endOfToday },
    });
    

    let availableQuestions = 0;
    if(existingSubscription){
      if(existingSubscription.planId === 'Free'){
        availableQuestions = 1 - questionsToday.length;
      } else if(existingSubscription.planId === 'Silver'){
        availableQuestions = 5 - questionsToday.length;
      } else if(existingSubscription.planId === 'Gold'){
        availableQuestions = 1;
      } else {
        availableQuestions = 0;
      }
    }

    res.status(200).json({
      active: status === "active",
      subscription: subscription,
      availableQuestions: availableQuestions,
    });
        // res.status(200).json({ active: status==='active', subscription: subscription})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to check Subscription' })
    }
}
