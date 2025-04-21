import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import rewardModel from "../models/reward.model.js";

const router = express.Router();


router.get("/",protectRoute, async (req, res) => {
    try {
        const userId = req.user._id;
        const rewards = await rewardModel.find({ user: userId });
        res.json(rewards);
    } catch (error) {
        console.error("Error getting rewards:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/leaderboard", protectRoute,async (req, res) => {
    try {
      // Aggregate rewards by user and sort by total points
      const leaderboard = await rewardModel.aggregate([
        {
          $sort: { totalPoints: -1 }, // Sort by total points in descending order
        },
        {
          $lookup: {
            from: "users", // Assuming your user collection is named 'users'
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            totalPoints: 1,
            "user._id": 1,
            "user.name": 1,
            "user.avatar": 1,
          },
        },
        {
          $limit: 20, // Limit to top 20 users
        },
      ])
  
      res.status(200).json(leaderboard)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      res.status(500).json({ message: "Failed to fetch leaderboard" })
    }
  })

export default router