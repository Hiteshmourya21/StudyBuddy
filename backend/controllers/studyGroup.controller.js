import mongoose from "mongoose";
import StudyGroup from "../models/studyGroup.model.js";


export const createStudyGroup = async (req, res) => {
    const { name, description, members } = req.body;
    members.push(req.user._id);
    const group = new StudyGroup({ name, description, members,leader: req.user._id });
    await group.save();
  
    res.json(group);
  }

export const sendMessageInGroup = async (req, res) => {
    const { groupId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;
    const group = await StudyGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
  
    group.messages.push({ sender: senderId, content: message });
    await group.save();
  
    res.json(group);
  }

export const getMessageInGroup = async (req, res) => {
    const { groupId } = req.params;

  const group = await StudyGroup.findById(groupId).populate("messages.sender", "name");
  if (!group) return res.status(404).json({ error: "Group not found" });

  res.json(group.messages);
}

export const searchStudyGroups =  async (req, res) => {
  const { search } = req.query;
  const groups = await StudyGroup.find({ name: new RegExp(search, "i") });
  res.json(groups);
};

export const getMyGroups = async (req, res) => {
  const groups = await StudyGroup.find({
    members: { $in: [req.user._id] },
  });
  res.json(groups);
};


export const getGroupInfo = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate if groupId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const group = await StudyGroup.findById(groupId).populate("members", "name");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};