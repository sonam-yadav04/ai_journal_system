import express from 'express';
import {auth} from "../middleware/auth.js";
import { validateJournal } from "../validators/journalValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  updateJournal,
  delJournal, 
  createJournal,
  getJournals,
  analyzeText,
  getInsights,
  getMoodTrend
}  from "../controller/journalController.js";


const router = express.Router();
router.post("/",auth,
              validateJournal,
              validateRequest,
              createJournal);

router.get("/", auth, getJournals);
router.post("/analyze",analyzeText);
router.get("/insights", auth ,getInsights);
router.delete("/:id" ,auth, delJournal);
router.put("/:id",auth,updateJournal);
router.get("/trend/",auth,getMoodTrend);


export default router;
 




