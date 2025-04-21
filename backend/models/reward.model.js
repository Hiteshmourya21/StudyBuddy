import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPoints: { type: Number, default: 0 },
  lastLoginDate: { type: Date }, // For daily login reward tracking
  breakdown: [
    {
      type: { type: String }, // e.g., 'quiz_score', 'resource_like'
      points: Number,
      sourceId: { type: mongoose.Schema.Types.ObjectId }, // e.g., quizId, postId
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Reward", rewardSchema);
