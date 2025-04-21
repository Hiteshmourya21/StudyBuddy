import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { addDailyLoginReward } from "./rewar.controller.js";

export const signup = async (req,res)=>{
    try {
        const {name, username, email, studyField, password} = req.body
        if(!name || !studyField || !email || !password || !username){
            return res.status(400).json({message: "Please fill in all fields."})
        }
        
        const exitingEmail = await User.findOne({ email })
        if (exitingEmail) {
            return res.status(400).json({message:"Email already exists"})
         }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
            studyField
        })

        await user.save();

        const token =  jwt.sign( { userId : user._id }, process.env.JWT_SECRET , { expiresIn: "3d" } )

        res.cookie("jwt-studybuddy", token, {
            httpOnly: true, // Prevents XSS:client-side JavaScript from accessing the cookie
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict", // Prevents CSRC : the cookie from being sent to other domains
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({  message:"User created successfully" });

        //todo : send verification email
       
    } catch (error) {
        console.log("Error signing up user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req,res)=>{
    try {
        
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        await addDailyLoginReward(user._id);

        const token =  jwt.sign( { userId : user._id }, process.env.JWT_SECRET , { expiresIn: "3d" } )

        res.cookie("jwt-studybuddy", token, {
            httpOnly: true, // Prevents XSS:client-side JavaScript from accessing the cookie
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict", // Prevents CSRC : the cookie from being sent to other domains
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({  message:"Logged in successfully" });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req,res)=>{
    res.clearCookie("jwt-studybuddy");
    res.json({message:"Logged out successfully"});
};

export const getCurrentUser = async(req,res) =>{
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error getCurrentUser controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}