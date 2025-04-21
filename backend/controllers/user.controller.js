import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Question from "../models/questions.model.js";
import StudyGroup from "../models/studyGroup.model.js";
import Resource from "../models/resource.model.js";
import QuizResult from "../models/quizResult.model.js";
import { addResourceLikeReward } from "./rewar.controller.js";
import questionsModel from "../models/questions.model.js";
import answersModel from "../models/answers.model.js";
import mongoose from "mongoose";

export const getSuggestedConnections = async (req, res) => {
    try {
        const currenUser = await User.findById(req.user.id).select("connections studyField");

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currenUser.connections
            },
            studyField: currenUser.studyField // added condition for matching studyField
        })
        .select("name username profilePicture headline")
        .limit(3);

        
        res.json(suggestedUser)
    } catch (error) {
        console.error("Error in getSuggestedConnections controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {

    try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"experience",
			"education",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}

        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }

        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg);
            updatedData.bannerImg = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new : true }).select("-password");

        res.json(user);

    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        // console.log(userId);
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getUserById controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
    
export const getSearchResults = async (req, res) => {
    try {
        
        const { category, q } = req.query;
        if (!category || !q) {
            return res.status(400).json({ message: "Category and query are required" });
        }
        
        if (!["student", "post", "forum", "groups"].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }
        
        let results = [];
        
        if (category === "student") {
            results = await User.find({
                $or: [
                    { username: { $regex: q, $options: "i" } },
                    { name: { $regex: q, $options: "i" } }
                ]
            }).select("-password");
        }

        if (category === "post") {
            results = await Post.find({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { content: { $regex: q, $options: "i" } }
                ]
            }).populate("author", "name username profilePicture headline").limit(10);
        }

        if (category === "forum") {
            results = await Question.find({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } }
                ]
            }).populate("user", "name username profilePicture headline").limit(10);
        }

        if (category === "groups") {
            results = await StudyGroup.find({
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } }
                ]
            });
        }

        return res.json(results);
    } catch (error) {
        console.error("Error in getSearchResults controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getResources = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        const resources = await Resource.find({user: user._id});
        res.json(resources);
    } catch (error) {
        console.error("Error in getResources controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const postResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const {name, link} = req.body;
        const resource = await Resource.create({name, link, user: userId});
        await resource.save();
        res.json(resource);
    } catch (error) {
        console.error("Error in postResource controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteResource = async (req, res) => {
    try {
        const {resourceId} = req.params;
        const resource = await Resource.findByIdAndDelete(resourceId);
        res.json(resource);
    } catch (error) {
        console.error("Error in deleteResource controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleLikeResource = async (req, res) => {
    try {
        const {resourceId} = req.params;
        const userId = req.user._id;
        const resource = await Resource.findById(resourceId);
        if (resource.likes.includes(userId)) {
            resource.likes.pull(userId);
        } else {
            resource.likes.push(userId);
            await addResourceLikeReward(resource.user, resourceId);
        }
        await resource.save();
        res.json(resource);
    } catch (error) {
        console.error("Error in toggleLikeResource controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getActivityData = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizResults = await QuizResult.find({ user: userId });

        let easy = 0, medium = 0, hard = 0;

        quizResults.forEach(result => {
            if (result.quizAttempts) {
                easy += result.quizAttempts.filter(attempt => attempt.difficulty.toLowerCase() === "easy").length;
                medium += result.quizAttempts.filter(attempt => attempt.difficulty.toLowerCase() === "medium").length;
                hard += result.quizAttempts.filter(attempt => attempt.difficulty.toLowerCase() === "hard").length;
            }
        });

        const difficultyData = [
            { name: 'Easy', value: easy },
            { name: 'Medium', value: medium },
            { name: 'Hard', value: hard },
        ];

        res.json(difficultyData);
    } catch (error) {
        console.error("Error in getActivityData controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const getPerformanceData = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const results = await QuizResult.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$quizAttempts" },
        { $match: { "quizAttempts.quizType": "manual" } },
        {
          $lookup: {
            from: "quizzes",
            localField: "quizAttempts.quiz",
            foreignField: "_id",
            as: "quizDetails"
          }
        },
        { $unwind: { path: "$quizDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$quizDetails.createdAt" } },
            subject: "$quizAttempts.subject",
            score: "$quizAttempts.score",
            difficulty: "$quizAttempts.difficulty"
          }
        }
      ]);
  
      res.json(results);
    } catch (err) {
      console.error("Error fetching performance data:", err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  


export const getWeeklyEngagement = async (req, res) => {
  try {
    const userId = req.user._id;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [posts, questions, answers, quizResults] = await Promise.all([
      Post.countDocuments({ author: userId, createdAt: { $gte: oneWeekAgo } }),
      questionsModel.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
      answersModel.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
      QuizResult.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
    ]);

    res.json({
      posts,
      questions,
      answers,
      quizAttempts: quizResults,
    });
  } catch (err) {
    console.error("Error fetching weekly engagement:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getResourceMetrics = async (req, res) => {
  try {
    const userId = req.user._id;

    const resources = await Resource.find({ user: userId });

    const data = resources.map((r) => ({
      title: r.name,
      likes: r.likes.length,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching resource metrics:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
