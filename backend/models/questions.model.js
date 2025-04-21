import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String },  // Cloudinary image URL
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', QuestionSchema);
