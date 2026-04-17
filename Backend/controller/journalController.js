import Journal from "../models/journal.js";
import { analyzeEmotion } from "../services/llmService.js";
import mongoose from "mongoose";


export const createJournal = async(req,res)=>{
    try{
       const userId = req.user.user_id;
      const { ambience, text } = req.body;
      if(!userId || !text){
       return res.status(400).json({
              message:"userId and text are required"
             });
            }
const analysis = await analyzeEmotion(text);
const journal = await Journal.create(
      {
        userId,
        ambience,
        text,
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        keywords: analysis.keywords,
        summary: analysis.summary
      });
  res.status(201).json({success:true, message:" journal created successfully", data: journal, analysis})     

    }
    catch(err){
            res.status(500).json({
            message:"error creating journal",
            error : err.message
        }); 
    }
}
 export const getJournals = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      emotion,
      sentiment,
      search,
      page = 1,
      limit = 5,
      sortBy = "latest"
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const filter = { userId };

    if (emotion) filter.emotion = emotion;
    if (sentiment) filter.sentiment = sentiment;

    if (search) {
      filter.text = { $regex: search, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const skip = (pageNum - 1) * limitNum;

    const total = await Journal.countDocuments(filter);

    const journals = await Journal.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: "journals fetched successfully",
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: journals,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "error fetching journals",
      error: err.message,
    });
  }
};
 export const analyzeText = async(req,res)=>{
    try{
       const{text} = req.body;
       if(!text){
        return res.status(400).json({message:"text is required"})
       }
        const result = await analyzeEmotion(text);
       res.status(200).json({
        success:true,
        message:"text analysis successful",
        result
       })
     }catch(err){
        res.status(500).json({
            success: false,
            message:"LLM analysis failed!",
            error:err.message
        }) }}

export const getInsights = async(req,res)=>
    { 
        try{
         const userId = req.user?.user_id; 
        const journals = await Journal.find({userId}); 
        const totalEntries = journals.length; 
        const emotionCount = {}; 
        const ambienceCount = {}; 
        const sentimentCount = {}; 
        let allKeywords = []; 
        let totalScore = 0; 
        journals.forEach(
            j=>{ totalScore += j.sentimentScore || 0; 
                if(j.emotion)
                    { emotionCount[j.emotion] = (emotionCount[j.emotion] || 0) + 1; 

                } if(j.ambience)
                    { ambienceCount[j.ambience] = (ambienceCount[j.ambience] || 0) +1;

                 } if(j.sentiment)
                    { sentimentCount[j.sentiment] = (sentimentCount[j.sentiment] || 0) +1;

                  } if(j.keywords)
                    { allKeywords = allKeywords.concat(j.keywords) } }); 
        const avgSentiment = totalEntries ? totalScore / totalEntries : 0;
         const emotionStats = Object.keys(emotionCount).map(key => ({ emotion: key, count: emotionCount[key] })); 
         const sentimentStats = Object.keys(sentimentCount).map(key=>({ sentiment :key, count: sentimentCount[key] }));
         const topEmotion = Object.keys(emotionCount).reduce( (a,b)=>( emotionCount[a]>emotionCount[b]?a:b ),"");
         const topAmbience = Object.keys(ambienceCount).reduce( (a,b)=>( ambienceCount[a] > ambienceCount[b]? a:b ),"")
        res.status(200).json(
            { avgSentiment, totalEntries, topEmotion, topAmbience,
                 emotionStats, sentimentStats, recentKeywords: allKeywords.slice(-5) }) 
         }catch(err){ 
            res.status(500).json({
                 success:false, 
                 message:"error generating insight", 
                 error : err.message }) }}      

export const delJournal = async(req,res)=>{
      try{
          const id = req.params.id
          const journal = await Journal.findByIdAndDelete(id);
           if (!journal) {
             return res.status(404).json({
            success: false,
           message: "Journal entry not found",
          });
          }
          res.status(200).json(
            {
                success:true,
                message: "journal entry is deleted successfully",
                data: journal
            }
          )

        }catch(err){
          return  res.status(500).json({
            success:false,
            message: "journal entry is not deleting",
            error: err.message
        })
        console.log(err)
      }
}

export const updateJournal = async(req,res)=>{
    try{
       const id = req.params.id;
       console.log("deleted id",id);
       const updatedJournal = await Journal.findByIdAndUpdate(id,
        req.body,
         {new : true}
       );
       if(!updatedJournal){
        return res.status(400).json({
            message:"no journal is find",
            success:false,
        }); }
        res.status(200).json({
            success:true,
            message:"journal updated successfully",
            data:updatedJournal
        })
     }catch(err){
        res.status(500).json(
            {
                success:false,
                message: "failed to update journal",
                error: err.message
            }
        )
    }
}


     export const getMoodTrend = async(req,res)=>{
     try{
        const  userId= req.user.user_id;  
        const trendData =  await Journal.aggregate([{
            $match:{userId: new mongoose.Types.ObjectId(userId)}
        },
        {
        $group:{
            _id:{$dateToString:{ format :"%Y-%m-%d", date :"$createdAt"}},

            avgSentiment:{  $avg:{ $ifNull: ["$sentimentScore",0]} }
        }},
        {
            $sort:{_id:1}
        },
        {  $project:{_id: 0, date : "$_id",avgSentiment : 1}}])
        res.status(200).json({
            success:true,
            data: trendData
        })
    }catch(err){
        console.log("Mood Trend Error", err)
        return res.status(500).json(
            {
                success :false,
                message : "server error",
               error : err.message
            }
        )
    }
}