import express from "express";
import ladder from "./api/ladder";
import events from "./api/events";
import userEvents from "./api/user_events";
import users from "./api/users";
import shop from "./api/shop";
import notifications from "./api/notifications";
import query from "./api/query";

const router = express.Router();

router.use("/ladder", ladder);
router.use("/events", events);
router.use("/user_events", userEvents);
router.use("/users", users);
router.use("/shop", shop);
router.use("/notifications", notifications);
router.use("/query", query);

export default router;
