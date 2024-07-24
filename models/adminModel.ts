import * as mongoose from "mongoose"

const adminSchema = new mongoose.Schema<AdminCreation>(
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
        Admin : {
            View : {
                type : Boolean
            },
            Add : {
                type : Boolean
            },
            Edit : {
                type : Boolean
            },
            Delete : {
                type : Boolean
            }
        },
        Course : {
            View : {
                type : Boolean
            },
            Add : {
                type : Boolean
            },
            Edit : {
                type : Boolean
            },
            Delete : {
                type : Boolean
            }
        },
        Batch : {
            View : {
                type : Boolean
            },
            Add : {
                type : Boolean
            },
            Edit : {
                type : Boolean
            },
            Delete : {
                type : Boolean
            }
        },
        Students : {
            View : {
                type : Boolean
            },
            Add : {
                type : Boolean
            },
            Edit : {
                type : Boolean
            },
            Delete : {
                type : Boolean
            }
        }
    },
    {
        timestamps : true
    }
)

interface AdminCreation {
    fullName : string
    email : string
    phone : number
    Admin : {
        View : boolean
        Add : boolean
        Edit : boolean
        Delete : boolean
    }
    Course : {
        View : boolean
        Add : boolean
        Edit : boolean
        Delete : boolean
    }
    Batch : {
        View : boolean
        Add : boolean
        Edit : boolean
        Delete : boolean
    }
    Students : {
        View : boolean
        Add : boolean
        Edit : boolean
        Delete : boolean
    }
}

export const adminModel = mongoose.model<AdminCreation>("admins", adminSchema)