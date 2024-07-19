import * as mongoose from "mongoose"

const courseSchema = new mongoose.Schema<CourseRegistration>(
    {
        courseName : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        duration : {
            type : Number,
            required : true
        },
        durationUnit : {
            type : String,
            required : true
        },
        isValid : {
            type : Boolean,
            default : false
        },
        topics : {
            type : Map,
            of : [ String ],
        }
    },
    {
        timestamps : true
    }
)

interface CourseRegistration {
    courseName : string,
    description : string,
    duration : number,
    durationUnit : string,
    isValid : boolean,
    topics ?: { [key: string]: string[] }
}

export const courseModel = mongoose.model<CourseRegistration>('courses', courseSchema)