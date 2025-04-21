import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: String,
  subject: String,
  difficulty: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

export default  mongoose.model("Quiz", quizSchema);
