import Question from "../models/questions.model.js";
import Answer from "../models/answers.model.js";
import cloudinary from "../lib/cloudinary.js"; 
import fs from "fs";
import { addHelpfulVoteReward } from "./rewar.controller.js";


export const postQuestion = async (req, res) => {
    try {
        const user = req.user._id;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);  // Deletes file from server after upload
        }

        const newQuestion = new Question({
            user: user,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            image: imageUrl
        });

        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "user", 
                    foreignField: "_id", 
                    pipeline: [
                        { $project: { name: 1, profilePicture: 1, _id: 0 } }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "answers", 
                    localField: "_id", 
                    foreignField: "question", 
                    pipeline: [
                        { $count: "count" }
                    ],
                    as: "answersCount"
                }
            },
            {
                $addFields: {
                    answersCount: { $ifNull: [{ $arrayElemAt: ["$answersCount.count", 0] }, 0] }
                }
            },
            {
                $project: {
                    "user.password": 0, // Ensures password is never included
                    "user.email": 0,
                }
            }
        ]);

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getQuestionById = async (req, res) => {
    try {
        let question = await Question.findById(req.params.id).populate('user', 'name profilePicture');
        if (!question) return res.status(404).json({ message: "Question not found" });

        const answers = await Answer.find({ question: req.params.id })
            .sort({ createdAt: -1 })
            .populate('user', 'name profilePicture');

        const questionWithAnswers = question.toObject(); // Convert to plain object
        questionWithAnswers.answers = answers;

        res.json(questionWithAnswers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const postAnANswer = async (req, res) => {
    try {
        const user = req.user._id;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const newAnswer = new Answer({
            user: user,
            question: req.params.id,
            text: req.body.text,
            image: imageUrl
        });
        await addHelpfulVoteReward(user, newAnswer._id);
        await newAnswer.save();
        res.status(201).json(newAnswer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const reactOnAnswer = async (req, res) => {
    try {
        const { reactionType } = req.body;
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        if (reactionType === 'helpful') answer.helpfulVotes += 1;
        else if (reactionType === 'notHelpful') answer.notHelpfulVotes += 1;

        await answer.save();
        res.json({ message: "Reaction added", answer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
