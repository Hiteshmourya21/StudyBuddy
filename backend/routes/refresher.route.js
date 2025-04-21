import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getRandomTextItems } from "../controllers/refresher.controller";

const router = express.Router();

router.get("/text/:activeTab",protectRoute, getRandomTextItems);

export default router;