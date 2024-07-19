import express from 'express'
import 'dotenv/config'
const port = process.env.port || 7000
import authRouter from "./router/authRouter"
import adminRouter from "./router/adminRouter" 
import cors from 'cors' 
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(express.json())

app.use("/auth", authRouter)
app.use("/admin", adminRouter)

mongoose.connect((process.env.mongo_url) as string)
.then(() => {
    console.log('mongodb connected succesfully');
    app.listen(port, ()=> console.log(`server is running at port ${port}`)) 
})
.catch(( error )=>{
    console.log(error);
})
