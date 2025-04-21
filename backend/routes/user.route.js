import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getActivityData, getSuggestedConnections, getPublicProfile, updateProfile, getUserById,
     getSearchResults, getResources, postResource, deleteResource, toggleLikeResource,
     getPerformanceData, getWeeklyEngagement, getResourceMetrics} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);

router.get("/:username", protectRoute, getPublicProfile);
router.get("/Id/:userId", getUserById);

router.put("/profile", protectRoute, updateProfile);

router.get("/query/search", getSearchResults);

router.get("/:userId/resources",protectRoute, getResources);
router.post("/resource",protectRoute, postResource);
router.delete("/resource/:resourceId",protectRoute, deleteResource);
router.put("/resource/:resourceId/like",protectRoute, toggleLikeResource);

router.get("/dashboard/acitivity",protectRoute, getActivityData);
router.get("/dashboard/performance", protectRoute, getPerformanceData);
router.get("/dashboard/engagement", protectRoute, getWeeklyEngagement);
router.get("/dashboard/resource-metrics", protectRoute, getResourceMetrics);




export default router;