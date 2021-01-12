import express from "express";
import ladder from "./api/ladder";
import events from "./api/events";
import userEvents from "./api/user_events";

import query from "./api/query";

const router = express.Router();

router.use("/ladder", ladder);
router.use("/events", events);
router.use("/user_events", userEvents);

router.use("/query", query);

export default router;
