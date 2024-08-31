import connectDb from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
    path: './env'
})

connectDb()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`running on port: ${process.env.PORT}`);
    
    })
})
.catch((err) => {
    console.log("Mongo DB connection failed", err);
})
/*
( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log(error);
        throw error
    }
})()
*/