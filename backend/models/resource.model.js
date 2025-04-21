import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource