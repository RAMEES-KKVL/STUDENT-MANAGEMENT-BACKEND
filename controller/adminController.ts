import { type Request, type Response } from "express"
import { courseModel } from "../models/courseModel"

export default {
    getCourses: async (req: Request, res: Response) => {
        try {            
            const courseList = await courseModel.find()
            if ( courseList ) {
                return res.status(200).json({ success : true, courseList })
            } else {
                return res.status(404).json({ success : false, message : "Couldn't find list" })
            }
        } catch (error) {
            return res.status(500).json({ success : false, message : "Server Error" })
        }
    },

    getAddedCourse: async (req: Request, res: Response) => {
        try {
            const courseName = req.query.courseName
            const addedCourse = await courseModel.findOne({ courseName })  
            
            if ( addedCourse ) {
                return res.status(200).json({ success : true, addedCourse })
            } else {
                return res.status(404).json({ success : false, message : "Couldn't find Course" })
            }
        } catch (error) {
            return res.status(500).json({ success : false, message : "Server Error" })
        }
    },

    addCourse: async (req: Request, res: Response)=>{
        const { courseName, description, duration, durationUnit } = req.body
        
        if ( !courseName || !description || ! duration || !durationUnit ) {
            return res.status(400).json({ success : false, message : "All fields are required" })
        } else {
            try {
                const courseExist = await courseModel.findOne({ courseName })

                // Checking that the course is already exist or not 
                if ( courseExist ) {
                    if ( courseExist.isValid ) {
                        return res.status(409).json({ success : false, message : "Course already exist" })
                    } else {
                        await courseModel.findOneAndUpdate(
                            {   
                                courseName 
                            },
                            {
                                $set : {
                                    description,
                                    duration,
                                    durationUnit
                                }
                            }
                        )
                        return res.status(200).json({ success : true })
                    }
                } else {
                    // Saving course details into database 
                    const newSchema = new courseModel({
                        courseName,
                        description,
                        duration,
                        durationUnit
                    })
                    const newCourse = await newSchema.save()
                    
                    if ( newCourse ) {
                        return res.status(200).json({ success : true, courseName })
                    } else {
                        return res.status(500).json({ success : false, message : "Couldn't add course, try again." })
                    }
                }
            } catch (error) {
                // catching the error
                return res.status(400).json({ success : false, message: 'Server error' })
            }
        }
    },

    addCourseTopic: async ( req: Request, res: Response ) => {
        try {
            const { 
                _id, 
                courseName, 
                description,
                duration,
                durationUnit,
                topics
            } = req.body
            
            if ( !courseName || !description || ! duration || !durationUnit || !topics ) {
                return res.status(400).json({ success : false, message : "All fields are required" })
            } else {
                const updated = await courseModel.findOneAndUpdate(
                    {
                        _id
                    },
                    {
                        $set : {
                            courseName,
                            description,
                            duration,
                            durationUnit,
                            isValid : true,
                            topics
                        }
                    },
                    {
                        upsert : true,
                    }
                )
                if ( updated ) {
                    return res.status(200).json({ success : true })
                } else {
                    return res.status(500).json({ success : false, message : "Couldn't add course, try again." })
                }
            }

        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    }
}