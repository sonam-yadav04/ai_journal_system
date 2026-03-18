import mongoose from 'mongoose';
const journalSchema = new mongoose.Schema(
    {
        userId :{
            type:String,
            required : true
        },
        ambience:{
            type:String
        },
        text:{
            type:String
        },
        emotion:{
            type:String
        },
        keywords: [String],
    },
    {timestamps:true}
);

const journal = mongoose.model("Journal", journalSchema);
export default journal;