import Reward from "../models/reward.model.js";

export const addHelpfulVoteReward = async (userId, answerId) => {
    try {
      const rewardPoints = 2;
      await Reward.findOneAndUpdate(
        { user: userId },
        {
          $inc: { totalPoints: rewardPoints },
          $push: {
            breakdown: {
              type: "forum_helpful_vote",
              points: rewardPoints,
              sourceId: answerId
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error adding helpful vote reward:", err);
    }
  };
  
  // 2. Likes on Resources
  export const addResourceLikeReward = async (userId, resourceId) => {
    try {
      const rewardPoints = 2;
      await Reward.findOneAndUpdate(
        { user: userId },
        {
          $inc: { totalPoints: rewardPoints },
          $push: {
            breakdown: {
              type: "resource_like",
              points: rewardPoints,
              sourceId: resourceId
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error adding resource like reward:", err);
    }
  };
  
  // 3. Attempts on Quiz Created by User
  export const addQuizAttemptReward = async (creatorId, quizId) => {
    try {
      const rewardPoints = 3;
      await Reward.findOneAndUpdate(
        { user: creatorId },
        {
          $inc: { totalPoints: rewardPoints },
          $push: {
            breakdown: {
              type: "quiz_attempt_on_created",
              points: rewardPoints,
              sourceId: quizId
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error adding quiz attempt reward:", err);
    }
  };
  
  // 4. Score from Attempted Quizzes Created by Others
  export const addQuizScoreReward = async (userId, quizResultId, score) => {
    try {
      const rewardPoints = score;
      await Reward.findOneAndUpdate(
        { user: userId },
        {
          $inc: { totalPoints: rewardPoints },
          $push: {
            breakdown: {
              type: "quiz_score",
              points: rewardPoints,
              sourceId: quizResultId
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error adding quiz score reward:", err);
    }
  };
  
  // 5. Likes on Posts
  export const addPostLikeReward = async (userId, postId) => {
    try {
      const rewardPoints = 1;
      await Reward.findOneAndUpdate(
        { user: userId },
        {
          $inc: { totalPoints: rewardPoints },
          $push: {
            breakdown: {
              type: "post_like",
              points: rewardPoints,
              sourceId: postId
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error adding post like reward:", err);
    }
  };
  
  // Optional daily login reward logic
  export const addDailyLoginReward = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    try {
      const reward = await Reward.findOne({ user: userId });
  
      // Already rewarded today?
      if (reward && reward.lastLoginDate) {
        const last = new Date(reward.lastLoginDate);
        last.setHours(0, 0, 0, 0);
        if (last.getTime() === today.getTime()) {
          return; // Exit early if reward already added today
        }
      }
  
      // Add reward
      await Reward.findOneAndUpdate(
        { user: userId },
        {
          $inc: { totalPoints: 5 },
          lastLoginDate: new Date(),
          $push: {
            breakdown: {
              type: "daily_login",
              points: 5,
              sourceId: userId,
            },
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error updating daily login reward:", err);
    }
  };
  