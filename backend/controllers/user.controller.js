import { z } from "zod";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import config from "../config.js";
import  {Purchase }  from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";


export const signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    console.log(req.body);

    const userSchema = z.object({
        firstname: z
            .string()
            .min(3, { message: "firstName must be atleast 3 char long" }),
        lastname: z
            .string()
            .min(3, { message: "lastName must be atleast 3 char long" }),
        email: z.string().email(),
        password: z
            .string()
            .min(8, { message: "password must be atleast 8 char long" }),
    })


    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) })
    }

    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ errors: "Email Already exists" });
        }
        const newUser = new User({ firstname, lastname, email, password: hashedpassword })
        await newUser.save();
        res.status(201).json({ message: "Signup Successfull", newUser })

    } catch (error) {
        res.status(500).json({ errors: "  failed to signup" })
        console.log("Error in signup ", error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!user || !isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid Credentials" })
        }
        // jwt code
        const token = jwt.sign(
            {
                id: user._id
            },
            config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        )
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),  //1day 
            httpOnly: true,     //does not allow   javascript to access it  directly
            secure: process.env.NODE_ENV === "production",  // becomses true when https , currently working on http
            sameSite: "Strict" //protects from CRSF attack 
        }
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login Successful", user, token })
        console.log("Login successful ",user)
    } catch (error) {
        res.status(500).json({ errors: "  Failed to login" })
        console.log("Error in login ", error);
    }
}

export const logout = (req, res) => {
    try {
       
        res.clearCookie("jwt")
        res.status(200).json({ message: "Logout Successfull" }) 
        console.log("logout succesfull")
    } catch (error) {
        res.status(500).json({ errors: "  failed to logout" })
        console.log("Error in logout ", error);
    }
}

export const purchases = async (req, res) => {
    const userId = req.userId;

    try {
        const purchased = await Purchase.find({ userId })
        let purchasedCourseId = []
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId)
        }
        const courseData = await Course.find({
            _id: { $in: purchasedCourseId }
        })
        res.status(200).json({ purchased, courseData });
    } catch (error) {
        return res.status(500).json({ errors: "  failed to " })
    }

}
 
