import express from "express";
import authController from "../controller/authController"
const Router = express.Router()

Router.post("/signup", authController.signupPost)
    
export default Router