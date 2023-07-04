import mongoose from 'mongoose';

const SubscriptionSchema = mongoose.Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
