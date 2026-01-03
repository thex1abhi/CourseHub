import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary'
import courseRoute from "./routes/course.routes.js"
import userRoute from "./routes/user.routes.js"
import adminRoute from "./routes/admin.route.js"
import cookieParser from "cookie-parser"; 
dotenv.config();
import cors from "cors"  
import paymentRoutes from "./routes/payment.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  // include common headers and correct Authorization spelling so preflight succeeds
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"],
})) 
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

async function start() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }





  //configuring cloudinary  for image upload
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

  app.use("/api/v1/course", courseRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/admin", adminRoute)
  app.use("/api/v1/payment", paymentRoutes);

  app.get('/', (req, res) => {
    res.send("Hello World ");
  }); 

 
 
 
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
start();

