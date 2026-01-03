import { z } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Admin } from "../models/admin.model.js"

export const signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    console.log(req.body);

    const adminSchema = z.object({
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


    const validatedData = adminSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) })
    }

    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        const existingAdmin = await Admin.findOne({ email: email })
        if (existingAdmin) {
            return res.status(400).json({ errors: "Admin Already exists" });
        }
        const newAdmin = new Admin({ firstname, lastname, email, password: hashedpassword })
        await newAdmin.save();
        res.status(201).json({ message: "Signup Successfull", newAdmin })

    } catch (error) {
        res.status(500).json({ errors: "  failed to admin signup" })
        console.log("Error in signup ", error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const admin = await Admin.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!admin || !isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid Credentials" })
        }
        // jwt code
        const token = jwt.sign(
            {
                id: admin._id
            },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        )
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),  //1day 
            httpOnly: true,     //does not allow   javascript to access it  directly
            secure: process.env.NODE_ENV === "production",  // becomses true when https , currently working on http
            sameSite: "Strict" //protects from CRSF attack 
        }
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login Successful", admin, token })
    } catch (error) {
        res.status(500).json({ errors: "  failed to login" })
        console.log("Error in login ", error);
    }
}

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

