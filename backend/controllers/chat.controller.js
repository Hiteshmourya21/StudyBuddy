import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";



export const startOneOnOneChat = async (req, res) => {
  const { userId, message } = req.body;
  const senderId = req.user._id;
  
  if (userId.toString() === senderId.toString()) return res.json([]);
  let chat = await Chat.findOne({
      participants: { $all: [senderId, userId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] } // Ensures only two users are in chat
  });

  if (!chat) {
      chat = new Chat({ participants: [senderId, userId], messages: [] });
  }

  chat.messages.push({ sender: senderId, content: message });
  await chat.save();

  res.json(chat);
};


export const getChatMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  if (!otherUserId) return res.json([]);
  if (otherUserId.toString() === userId.toString()) return res.json([]);

  const chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] } // Ensures it's a one-on-one chat
  }).populate("messages.sender", "name");

  res.json(chat ? chat.messages : []);
};


export const searchForUser = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json([]);
  
  const users = await User.find({ 
      name: { $regex: query, $options: "i" } 
  }).select("_id name profilePicture");
  
  res.json(users);
}

export const getRecentChats =  async (req, res) => {
  const userId = req.user.id; // Ensure authentication
  const recentChats = await Chat.find({ participants: userId })
      .populate("participants", "_id name profilePicture")
      .sort({ updatedAt: -1 })
      .limit(10);

  const chatUsers = recentChats.flatMap(chat =>
      chat.participants.filter(user => user.id !== userId)
  );

  res.json(chatUsers);
}