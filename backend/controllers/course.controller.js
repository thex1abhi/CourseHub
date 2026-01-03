import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import  {Purchase }  from "../models/purchase.model.js";
import { getInstance } from "../utils/razorpay.js";


export const createCourse = async (req, res) => { 
    const adminId=req.adminId;
    const { title, description, price } = req.body;
    const { image } = req.files;
    try {
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "All fields are required" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "No image uploaded" })
        }
        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ errors: "Invalid File format,Only jpg and png are allowed" })
        }
        //cloudinary 

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ error: "Error uploaind file to cloudinary" })
        }



        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
         creatorId:adminId
        }
        const course = await Course.create(courseData)
        console.log("Course Created");
        res.json({
            message: "Course Created Successfully",
            course,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: "Error Creating Course" })
    }


}

export const updateCourse = async (req, res) => {
    const { courseId } = req.params; 
    const adminId=req.adminId 
    const { title, description, price, image } = req.body;

    try { 
        const courseSearch=await Course.findById(courseId) 
   if(!courseSearch){
    return res.status(404).json({errors:"Course not found"})
   }
        const course = await Course.findOneAndUpdate({
            _id: courseId, 
            creatorId:adminId,
        }, {
            title,
            description,
            price,
            image: {
                public_id: image?.public_id,
                url: image?.url
            }
        }) 
        if(!course){
            return res.status(404).json({errors:"Cannot update Course Created By another Admin"})
        }
        res.status(201).json({ message: "Course Updated Successfully", course })
    } catch (error) {

        res.status(500).json({ errors: "Course Updation failed" })
        console.log("Error in course Update", error);
    }
}

export const deleteCourse = async (req, res) => {
    const { courseId } = req.params; 
    const adminId=req.adminId
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId:adminId 
        })
        if (!course) {
            return res.status(404).json({ error: "Cannot delete Course Created By another Admin" })
        }
        res.status(200).json({ message: "Course Deleted Succesfully" });
    } catch (error) {
        res.status(500).json({ errors: "Course Deletion failed" })
        console.log("Error Deleting Course ");
    }
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(201).json({ courses })
    } catch (error) {
        res.status(500).json({ errors: "  failed to get courses" })
        console.log("Error Finding  Course ");
    }
}

export const CourseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ error: "Course Not found" })
        }
        res.status(201).json({ course })
    } catch (error) {
        res.status(500).json({ errors: "  failed to get course" })
        console.log("Error Finding  Course ");
    }
}

export const buyCourses = async (req, res) => {
    // console.log("runnig buycourses");
    const { userId } = req;
    // console.log(userId);
    const { courseId } = req.params;
    // console.log(courseId) ;
    try {
        const course = await Course.findById(courseId);
        //   console.log(course);
        if (!course) {
            return res.status(404).json({ errors: "Course not found" })
        }
        // accept courseId from params (old flow) or body (when called from payment route)
        const resolvedCourseId = req.params.courseId || req.body.courseId || courseId;
        const existingPurchase = await Purchase.findOne({ userId, courseId: resolvedCourseId })
        if (existingPurchase) {
            return res.status(400).json({ errors: "Course already Purchased by user" })
        }

        // Create Razorpay order for this course
        const courseToBuy = await Course.findById(resolvedCourseId);
        if (!courseToBuy) {
            return res.status(404).json({ errors: "Course not found" });
        }

        const options = {
            amount: Math.round(Number(courseToBuy.price) * 100), // amount in paise
            currency: "INR",
            receipt: `rcpt_${resolvedCourseId}_${userId}`,
            payment_capture: 1,
        };

        const instance = getInstance();
        const order = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            order,
            courseName: courseToBuy.title,
            courseId: resolvedCourseId,
            userId,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        res.status(500).json({ errors: "  failed to buy course" })
        console.log("Error buying  Course ");
    }
}  

