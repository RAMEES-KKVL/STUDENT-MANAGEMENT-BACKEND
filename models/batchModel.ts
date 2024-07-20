import * as mongoose from "mongoose"

const batchSchema = new mongoose.Schema<BatchCreation>(
    {
        batchName : {
            type : String,
            required : true
        },
        startingDate : {
            type : Date,
            required : true
        },
        strength : []
    },
    {
        timestamps : true
    }
)

interface BatchCreation {
    batchName : string,
    startingDate : Date,
    strength : Array<string>
}

export const batchModel = mongoose.model<BatchCreation>("batches", batchSchema)