import { type Request, type Response } from "express";
import { signupData } from "../models/signup";
import * as bcrypt from 'bcryptjs'
import sendOTPEmail from "../utilities/nodemailer.service"
import jwt from "jsonwebtoken"

export default {
    signupPost : async (req: Request, res: Response) =>{
        const { fullName, email, phone, password, confirmPassword } = req.body

        if ( !fullName || !email || !phone || !password || !confirmPassword ) {
            return res.status(400).json({ success : false, missingData : true, message : "All fields are required" })
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const phoneRegex = /^\d{10}$/
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8}$/
            const isEmailValid = emailRegex.test(email)
            const isPhoneValid = phoneRegex.test(phone)
            const isPasswordValid = passwordRegex.test(password) 

            // Backend validation
            if ( !isEmailValid ) {
                return res.status(422).json({ success : false, invalidEmail : true, message : "Please enter a valid email address." })
            } else if ( !isPhoneValid ) {
                return res.status(422).json({ success : false, invalidPhone : true, message : "Please provide a valid mobile number" })
            } else if ( !isPasswordValid ) {
                return res.status(422).json({ success : false, invalidPassword : true, message : "Please enter a valid password" })
            } else if ( confirmPassword !== password ) {
                return res.status(400).json({ success : false, passwordMissmatch : true, message : "Passwords do not match. Please re-enter your password" })
            } else {

                try {
                    const hashedPassword = await bcrypt.hash(password, 10)  // Hashing the password
                    const userExist = await signupData.findOne({ email })
                    
                    if ( userExist ) {
                        // Checks user is verified or not
                        if ( !userExist.isVerified ) {
                            const otp = 1234
                            sendOTPEmail(email, otp)
                            return res.status(200).json({ success : true, notVerified : true })
                        } else {
                            return res.status(409).json({ success : false, notVerified : false, message : "User already exist" })
                        }
                    } else {
                        // Creating new user data 
                        const newSchema = new signupData({
                            fullName,
                            email,
                            phone,
                            password: hashedPassword,
                        })
                        const newUser = await newSchema.save()
                        
                        if ( newUser ){
                            // Sending OTP through nodemailer
                            const otp = 1234
                            sendOTPEmail(email, otp)
                            return res.status(200).json({ success : true, isDataSaved : true })
                        } else {
                            return res.status(500).json({ success : false, isDataSaved : false, message : "Signup failed, try again later" })
                        }
                    }
                    
                } catch (error) {
                    // catching the error
                    return res.status(400).json({ message: 'Server error' })
                }
            }
        }
    },

    loginPost: async (req: Request, res: Response)=>{
        const { email, password } = req.body

        if ( !email || !password ) {
            return res.status(400).json({ success : false, missingData : true, message : "Provide reequired datas" })
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8}$/
            const isEmailValid = emailRegex.test(email)
            const isPasswordValid = passwordRegex.test(password)

            // Backend validation
            if ( !isEmailValid ) {
                return res.status(422).json({ success : false, invalidEmail : true, message : "Please enter a valid email address." })
            } else if ( !isPasswordValid ) {
                return res.status(422).json({ success : false, invalidPassword : true, message : "Please enter a valid password" })
            } else {

                try {
                    const existingUser = await signupData.findOne({ email })

                    if ( !existingUser ) {
                        return res.status(404).json({ success : false, noUser : true, message : "User does not exist" })
                    } else {
                        const passMatch = await bcrypt.compare( password, existingUser.password )
                        if ( !passMatch ) {
                            return res.status(401).json({ success : false, invalidPassword : true, message : "Password does not match" })
                        } else {
                            if ( existingUser.isVerified ) {
                                if ( existingUser.isBlocked ) {
                                    return res.status(403).json({ success : false, isBlocked : true, message : "Login failed. Try again later" })
                                } else {
                                    // Creating user token
                                    const payload = {
                                        user : existingUser
                                    }
                                    const secret = process.env.jwt_secret as string
                                    const token = jwt.sign(payload, secret, { expiresIn: "48h" })
                                    return res.status(200).json({ success : true, user : true, token })
                                }   
                            } else {
                                // Sending OTP through nodemailer
                                const otp = 1234
                                sendOTPEmail(email, otp)
                                return res.status(200).json({ success : true, notVerified : true })
                            }
                        }
                    }
                } catch ( error ) {
                    // catching error 
                    return res.status(400).json({ success : false, message : "Server error" })
                }
            }
        }
    },

}







