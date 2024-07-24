import { type Request, type Response } from "express"
import { courseModel } from "../models/courseModel"
import { batchModel } from "../models/batchModel"
import { studentData } from "../models/studentModel"
import { adminModel } from "../models/adminModel"

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
                        const addedCourse = await courseModel.findOne({ courseName })
                        return res.status(200).json({ success : true, courseName, addedCourse })
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
    },

    deleteCourse: async ( req: Request, res: Response ) => {
        try {
            const courseName = req.query.courseName
            const deleted = await courseModel.findOneAndDelete({ courseName })
            if ( deleted ) {
                return res.status(200).json({ success : true })
            } else {
                return res.status(500).json({ success : false, message : "Couldn't delete Course" })
            }
        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },

    getBatches: async ( req: Request, res: Response )=>{
        try {            
            const batchList = await batchModel.find()
            if ( batchList ) {
                return res.status(200).json({ success : true, batchList })
            } else {
                return res.status(404).json({ success : false, message : "Couldn't find list" })
            }
        } catch (error) {
            return res.status(500).json({ success : false, message : "Server Error" })
        }
    },

    addBatch: async ( req: Request, res: Response )=>{
        const { batchName, startingDate } = req.body
        if ( !batchName || !startingDate ) {
            return res.status(400).json({ success : false, message : "All fields are required" })
        } else {
            try {
                const batchExist = await batchModel.findOne({ batchName })
                if ( batchExist ) {
                    return res.status(409).json({ success : false, message : "Batch already exist" })
                } else {
                    // Saving course details into database 
                    const newSchema = new batchModel({
                        batchName,
                        startingDate
                    })
                    const batchCreated = await newSchema.save()

                    if ( batchCreated ) {
                        const createdBatch = await batchModel.findOne({ batchName })
                        return res.status(200).json({ success : true, createdBatch })
                    } else {
                        return res.status(500).json({ success : false, message : "Couldn't add batch, try again." })
                    }
                }
            } catch (error) {
                // catching the error
                return res.status(400).json({ success : false, message: 'Server error' })
            }
        }       
    },

    deleteBatch: async ( req: Request, res: Response )=>{
        try {
            const batchName = req.query.batchName
            const deleted = await batchModel.findOneAndDelete({ batchName })
            if ( deleted ) {
                return res.status(200).json({ success : true })
            } else {
                return res.status(500).json({ success : false, message : "Cou;dn't delete Batch" })
            }
        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },

    editBatch: async ( req: Request, res: Response )=>{
        const { batchName, startingDate } = req.body
        const batchId = req.query.batchId
        
        if ( !batchName || !startingDate ) {
            return res.status(400).json({ success : false, message : "All fields are required" })
        } else {
            try {
                const updated = await batchModel.findOneAndUpdate(
                    {
                        _id : batchId
                    },
                    {
                        $set : {
                            batchName,
                            startingDate
                        }
                    }
                )

                if ( updated ) {
                    const updatedBatch = await batchModel.findOne({ _id : batchId })
                    return res.status(200).json({ success : true, updatedBatch })
                } else {
                    return res.status(500).json({ success : false, message : "Couldn't update Batch details" })
                }
            } catch (error) {
                // catching the error
                return res.status(400).json({ success : false, message: 'Server error' })
            }
        }
    },

    getStudents: async ( req: Request, res: Response )=>{
        try {            
            const studentsList = await studentData.find()
            if ( studentsList ) {
                return res.status(200).json({ success : true, studentsList })
            } else {
                return res.status(404).json({ success : false, message : "Couldn't find list" })
            }
        } catch (error) {
            return res.status(500).json({ success : false, message : "Server Error" })
        }
    },

    addStudent: async ( req: Request, res: Response )=>{
        const { 
            fullName, 
            email,
            phone,
            course,
            batch
        } = req.body        
        
        try {
            if ( !fullName || !email || ! phone || !course || !batch ) {
                return res.status(400).json({ success : false, message : "All fields are required" })
            } else if ( await studentData.findOne({ email }) ) {
                return res.status(409).json({ success : false, message : "Email already exist" })
            } else {
                const batchAdded = await batchModel.findOneAndUpdate(
                    {
                        batchName : batch
                    },
                    {
                        
                        $push : {
                            strength : email
                        }
                    },
                    {
                        new: true 
                    }
                )
                if ( batchAdded ) {
                    const newSchema = new studentData({
                        fullName,
                        email,
                        phone,
                        course,
                        batch
                    })
                    const added = await newSchema.save()
                    if ( added ) {
                        const addedStudent = await studentData.findOne({ email })
                        return res.status(200).json({ success : true, addedStudent })
                    } else {
                        await batchModel.findOneAndUpdate(
                            {
                                batchName : batch
                            },
                            {
                                
                                $pull : {
                                    strength : email
                                }
                            },
                            {
                                new: true 
                            }
                        )
                        return res.status(500).json({ success : false, message : "Couldn't add student, try again." })
                    }
                } else {
                    return res.status(500).json({ success : false, message : "Couldn't add student, try again." })
                }
            }
        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },

    editStudent: async ( req: Request, res: Response )=>{
        const { 
            fullName, 
            email,
            phone,
            course,
            batch 
        } = req.body
        const studentId = req.query.studentId
        
        if ( !fullName || !email || ! phone || !course || !batch ) {
            return res.status(400).json({ success : false, message : "All fields are required" })
        } else {
            try {
                const updated = await studentData.findOneAndUpdate(
                    {
                        _id : studentId
                    },
                    {
                        $set : {
                            fullName,
                            email : email,
                            phone,
                            course,
                            batch
                        }
                    } 
                )

                if ( updated ) {
                    const updatedStudent = await studentData.findOne({ _id : studentId })
                    return res.status(200).json({ success : true, updatedStudent })
                } else {
                    return res.status(500).json({ success : false, message : "Couldn't update Student details" })
                }
            } catch (error: any) {
                if ( error.codeName === "DuplicateKey" ) {
                    return res.status(400).json({ success : false, message: 'Email already exist' })
                } else {
                    return res.status(400).json({ success : false, message: 'Server error' })
                }
            }
        }
    },

    deleteStudent: async ( req: Request, res: Response )=>{
        try {
            const studentId = req.query.studentId
            const studentdata = await studentData.findOne({ _id : studentId })
            const email = studentdata?.email
            const batchName = studentdata?.batch
            const removedFromBatch = await batchModel.findOneAndUpdate(
                {
                    batchName
                },
                {
                    $pull : {
                        strength : email
                    }
                },
                {
                    new : true
                }
            )
            if ( removedFromBatch ) {
                const deleted = await studentData.findOneAndDelete({ _id : studentId })
                if ( deleted ) {
                    return res.status(200).json({ success : true })
                } else {
                    await batchModel.findOneAndUpdate(
                        {
                            batchName
                        },
                        {
                            $push : {
                                strength : email
                            }
                        },
                        {
                            new : true
                        }
                    )
                    return res.status(500).json({ success : false, message : "Couldn't remove Student details" })
                }
            } else {
                return res.status(500).json({ success : false, message : "Couldn't remove Student details" })
            }
        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },

    getAdmin: async ( req: Request, res: Response ) => {
        try {
            const adminList = await adminModel.find()
            if ( adminList ) {
                return res.status(200).json({ success : true, adminList })
            } else {
                return res.status(404).json({ success : false, message : "Couldn't find list" })
            }
        } catch (error) {
            // catching the error
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },

    addAdmin: async ( req: Request, res: Response ) => {
        const { 
            fullName,
            email, 
            phone, 
            Admin, 
            Course, 
            Batch, 
            Students 
        } = req.body

        if ( !fullName || !email || ! phone || !Admin || !Course || !Batch || !Students ) {
            return res.status(400).json({ success : false, message : "All fields are required" })
        } else {
            try {
                if ( await adminModel.findOne({ email }) ) {
                    return res.status(409).json({ success : false, message : "Email already exist" })
                } else {
                    const newSchema = new adminModel({
                        fullName,
                        email,
                        phone,
                        Admin,
                        Course,
                        Batch,
                        Students
                    })
                    const adminAdded = await newSchema.save()

                    if ( adminAdded ) {
                        const addedAdmin = await adminModel.findOne({ email })
                        return res.status(200).json({ success : true, addedAdmin })
                    } else {
                        return res.status(500).json({ success : false, message : "Couldn't add Admin, try again." })
                    }
                }
            } catch (error) {
                // catching the error
                return res.status(400).json({ success : false, message: 'Server error' })
            }
        }
    },

    editAdmin: async ( req: Request, res: Response ) => {
        try {
            const { 
                fullName,
                email, 
                phone, 
                Admin, 
                Course, 
                Batch, 
                Students 
            } = req.body
            const adminId = req.query.adminId
    
            if ( !fullName || !email || ! phone || !Admin || !Course || !Batch || !Students ) {
                return res.status(400).json({ success : false, message : "All fields are required" })
            } else {
                
                const updated = await adminModel.findOneAndUpdate(
                    {
                        _id : adminId
                    },
                    {
                        $set : {
                            fullName,
                            email,
                            phone,
                            Admin,
                            Course,
                            Batch,
                            Students
                        }
                    }
                )

                if ( updated ) {
                    const updatedAdmin = await adminModel.findOne({ _id : adminId })
                    return res.status(200).json({ success : true, updatedAdmin })
                } else {
                    return res.status(500).json({ success : false, message : "Couldn't update Admin details" })
                }
            }
        } catch (error: any) {
            // catching the error            
            if ( error.codeName === "DuplicateKey" ) {
                return res.status(400).json({ success : false, message: 'Email already exist' })
            } else {
                return res.status(400).json({ success : false, message: 'Server error' })
            }
        }
    },

    deleteAdmin: async ( req: Request, res: Response ) => {
        try {
            const adminId = req.query.adminId            
            const deleted = await adminModel.findByIdAndDelete({ _id : adminId })
            if ( deleted ) {
                return res.status(200).json({ success : true })
            } else {
                return res.status(500).json({ success : false, message : "Batch creation failed" })
            }
        } catch (error) {
            return res.status(400).json({ success : false, message: 'Server error' })
        }
    },
}
