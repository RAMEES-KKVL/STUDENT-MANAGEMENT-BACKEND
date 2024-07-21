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
Router.delete("/delete-batch", adminController.deleteBatch)
Router.patch("/edit-batch", adminController.editBatch)

Router.get("/students", adminController.getStudents)
Router.post("/add-student", adminController.addStudent)

export default Router