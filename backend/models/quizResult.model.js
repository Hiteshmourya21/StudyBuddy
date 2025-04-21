import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizAttempts:[{
            quizType : {type:String,required:true,enum:["manual","ai"]},
            quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
            subject: String,
            difficulty: String,
            score: Number
        }]
}); 

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;