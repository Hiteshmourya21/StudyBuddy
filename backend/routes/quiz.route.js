import express from "express";
import { getQuiz, storeQuiz, storeResults, getPreviousAiResults, getUserQuizes, getQuizById, getUserCreatedQuizes, getUserAttempts, deleteQuiz } from "../controllers/quiz.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();
router.use(protectRoute);

router.get("/", getQuiz);
router.get("/user",getUserQuizes);
router.get("/user/created", getUserCreatedQuizes);
router.get("/:quizId", getQuizById);
router.get("/user/attempts", getUserAttempts);

router.post("/",storeQuiz);
router.post("/results", storeResults);

router.get("/result/ai/previous", getPreviousAiResults);

router.delete("/delete/:id", deleteQuiz);

export default router

