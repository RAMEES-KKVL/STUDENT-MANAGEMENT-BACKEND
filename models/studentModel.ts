import * as mongoose from 'mongoose'

const studentSchema = new mongoose.Schema<studentRegistration>(
    {
        fullName : {
            type : String,
            required : true
        },
        email : {
            type : String,
            unique : true,
            required : true
        },
        phone : {
            type : Number,
            required : true
        },
        course : {
            type : String,
            required : true
        },
        batch : {
            type : String,
            required : true
        }
    }, 
    {
        timestamps : true
    }
)

interface studentRegistration {
    fullName : string,
    email : string,
    phone : number, 
    course : string,
    batch : string
}

export const studentData = mongoose.model<studentRegistration>('student-datas', studentSchema)
