import Journal from "../models/journal.js";
import { analyzeEmotion } from "../services/llmService.js";

export const createJournal = async(req,res)=>{
    try{
      const { userId, ambience, text } = req.body;
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
        emotion : analysis.emotion,
        keywords: analysis.keywords
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
 
 export const getJournals = async(req,res)=>{
    try{
        const{userId} = req.params;
        const journals = await Journal.find({userId}).sort({createdAt: -1});
        res.status(200).json(
          journals

         )

    }catch(err){
        res.status(500).json({
            success: false,
            message:'failed to fetch journal',
             error  : err.message
        })
    }
} 
 
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

export const getInsights = async(req,res)=>{
    try{
       const{userId} = req.params;
       const journals = await Journal.find({userId});
       const totalEntries = journals.length;
       const emotionCount = {};
       const ambienceCount = {};
       let allKeywords = [];

       journals.forEach(j=>{
        if(j.emotion){
            emotionCount[j.emotion] = (emotionCount[j.emotion] || 0) + 1;
        }
        if(j.ambience){
            ambienceCount[j.ambience] = (ambienceCount[j.ambience] || 0) +1;
        }
        if(j.keywords){
            allKeywords = allKeywords.concat(j.keywords)
        }
       });
       const topEmotion = Object.keys(emotionCount).reduce(
        (a,b)=>(
            emotionCount[a]>emotionCount[b]?a:b
        ),"")
        const topAmbience = Object.keys(ambienceCount).reduce(
            (a,b)=>(
                ambienceCount[a] > ambienceCount[b]? a:b
            ),"")
            res.status(200).json({
                totalEntries,
                topEmotion,
                topAmbience,
                recentKeywords: allKeywords.slice(-5)
            })
     }catch(err){
        res.status(500).json({
            success:false,
            message:"error generating insight",
            error : err.message
        }) }}        