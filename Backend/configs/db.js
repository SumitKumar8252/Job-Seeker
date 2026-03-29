import mongoose from "mongoose"

export const connectToDB= async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB is connected ✅")
    } catch (error) {
        console.log("Error in DB : ", error.message)
    }
}
