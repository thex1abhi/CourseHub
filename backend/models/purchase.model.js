import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref:"User"
  
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref:"Course"
  }
  
});

export const Purchase = mongoose.model("Purchase", PurchaseSchema);