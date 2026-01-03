import Razorpay from "razorpay";
import crypto from "crypto";
import { Purchase } from "../models/purchase.model.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_order_" + Math.random(),
    };

    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // save purchase
      const courseId = req.body.courseId;
      // try to get userId from middleware (req.userId) or body
      const userId = req.userId || req.body.userId;
      if (!userId || !courseId) {
        return res.status(400).json({ success: false, message: "Missing user or course id" });
      }

      const existing = await Purchase.findOne({ userId, courseId });
      if (existing) {
        return res.status(200).json({ success: true, message: "Already purchased", purchase: existing });
      }

      const newPurchase = new Purchase({ userId, courseId });
      await newPurchase.save();

      return res.status(201).json({ success: true, message: "Payment verified and purchase saved", purchase: newPurchase }); 
      
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log(error);
  }
};
