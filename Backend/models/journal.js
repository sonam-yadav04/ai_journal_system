import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ambience: {
      type: String,
      default: "forest",
    },
    text: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      default: "neutral",
    },
    sentiment: {
      type: String,
      default: "neutral",
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
journalSchema.index({ userId: 1 });
journalSchema.index({ emotion: 1 });
journalSchema.index({ sentiment: 1 });
journalSchema.index({ createdAt: -1 });
export default mongoose.model("Journal", journalSchema);