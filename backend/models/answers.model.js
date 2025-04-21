import mongoose from "mongoose";



const AnswerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    text: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    helpfulVotes: { type: Number, default: 0 },
    notHelpfulVotes: { type: Number, default: 0 }
});

export default mongoose.model('Answer', AnswerSchema);
