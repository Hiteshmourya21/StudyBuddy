import express from "express";
import { getAllQuestions, postQuestion, getQuestionById, postAnANswer, reactOnAnswer } from "../controllers/forum.controller.js";
import { upload } from "../lib/multer.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.post('/question', upload.single('image'), postQuestion);

// 📌 Get all questions
router.get('/questions', getAllQuestions);

// 📌 Get a specific question with answers
router.get('/question/:id', getQuestionById);

// 📌 Post an answer
router.post('/question/:id/answer', upload.single('image'), postAnANswer);

// 📌 React to an answer (Helpful/Not Helpful)
router.post('/answer/:id/react', reactOnAnswer);

export default router