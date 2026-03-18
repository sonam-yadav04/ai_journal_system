import express from 'express';
import {
  createJournal,
  getJournals,
  analyzeText,
  getInsights
}  from "../controller/journalController.js";

const router = express.Router();
router.post("/", createJournal);
router.get("/:userId", getJournals);
router.post("/analyze", analyzeText);
router.get("/insights/:userId", getInsights);

export default router;





