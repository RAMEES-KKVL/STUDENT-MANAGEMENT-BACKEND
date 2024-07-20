import express from "express";
import adminController from "../controller/adminController";
const Router = express.Router()

Router.get("/courses", adminController.getCourses)
Router.get("/added-course", adminController.getAddedCourse)
Router.post("/add-course", adminController.addCourse)
Router.post("/add-course_topics", adminController.addCourseTopic)
Router.delete("/delete-course", adminController.deleteCourse)

Router.get("/batches", adminController.getBatches)
Router.post("/add-batch", adminController.addBatch)

export default Router