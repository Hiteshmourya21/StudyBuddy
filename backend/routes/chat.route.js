import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getChatMessages, getRecentChats, searchForUser, startOneOnOneChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/send",protectRoute,startOneOnOneChat);

router.get("/search",protectRoute,searchForUser);
router.get("/recent",protectRoute,getRecentChats);

router.get("/:otherUserId", protectRoute, getChatMessages);

export default router;