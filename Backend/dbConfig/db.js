import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

const path = configDotenv()
const mongo_uri = process.env.mongo_url;
const DBConnect = mongoose.connect(mongo_uri).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("error ehile connecting to the database");
});
export default DBConnect;