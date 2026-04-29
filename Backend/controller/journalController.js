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
export const getInsights = async (req, res) => {
  try {
    const userId = req.user?.user_id;

    const result = await Journal.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $facet: {
          totalEntries: [
            { $count: "count" }
          ],

          emotions: [
            { $group: { _id: "$emotion", count: { $sum: 1 } } }
          ],

          sentiments: [
            { $group: { _id: "$sentiment", count: { $sum: 1 } } }
          ],

          ambience: [
            { $group: { _id: "$ambience", count: { $sum: 1 } } }
          ],

          avgSentiment: [
            {
              $group: {
                _id: null,
                avg: { $avg: "$sentimentScore" }
              }
            }
          ],

          keywords: [
            { $unwind: "$keywords" },
            {
              $group: {
                _id: null,
                allKeywords: { $push: "$keywords" }
              }
            }
          ]
        }
      }
    ]);

    const data = result[0];

    const emotionStats = data.emotions.map(e => ({
      emotion: e._id,
      count: e.count
    }));

    const sentimentStats = data.sentiments.map(s => ({
      sentiment: s._id,
      count: s.count
    }));

    const topEmotion = data.emotions.length
      ? data.emotions.sort((a, b) => b.count - a.count)[0]._id
      : null;

    const topAmbience = data.ambience.length
      ? data.ambience.sort((a, b) => b.count - a.count)[0]._id
      : null;

    res.status(200).json({
      success: true,
      totalEntries: data.totalEntries[0]?.count || 0,
      avgSentiment: data.avgSentiment[0]?.avg || 0,
      emotionStats,
      sentimentStats,
      topEmotion,
      topAmbience,
      recentKeywords: data.keywords[0]?.allKeywords.slice(-5) || []
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating insights",
      error: err.message
    });
  }
};
   export const delJournal = async(req,res)=>{
      try{
          const id = req.params.id;
          const userId = req.user?.user_id;
          const journal = await Journal.findByIdAndDelete({ _id: id, userId: userId });
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
        const userId = req.user?.user_id;
       const updatedJournal = await Journal.findByIdAndUpdate({_id:id, userId:userId},
        req.body,
         {new : true, runValidators:true}
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