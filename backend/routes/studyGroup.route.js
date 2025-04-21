import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createStudyGroup, getGroupInfo, getMessageInGroup, getMyGroups, searchStudyGroups, sendMessageInGroup } from "../controllers/studyGroup.controller.js";

const router = express.Router();

router.post("/create",protectRoute,createStudyGroup);

router.get("/",protectRoute,searchStudyGroups);
router.get("/:groupId",protectRoute,getGroupInfo);
router.get("/my-groups/info",protectRoute,getMyGroups);

router.post("/:groupId/messages", protectRoute, sendMessageInGroup);
router.get("/:groupId/messages", protectRoute, getMessageInGroup);

export default router;