import express from "express";
import {
  getUsersWithFreebieSession,
  usersByNumSocialSignups,
  getRecentlyCreatedUsers,
} from "../../../queries/admin";
import { sendGroupMessage } from "../../../queries/notifications";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get("/social-signups", async (req, res) => {
  usersByNumSocialSignups(req.query).then((result) => {
    res.send({ success: true, result });
  });
});

router.get("/potential-socials", async (req, res) => {
  const mode = req.query.mode;
  let query;
  switch (mode) {
    case "RECENT":
      query = getRecentlyCreatedUsers;
      break;
    case "FREEBIE":
      query = getUsersWithFreebieSession;
      break;
    default:
      break;
  }

  if (!query) {
    res.send({ success: false, message: "incorrect parameter for mode" });
  }

  query().then((result) => {
    res.send({ success: true, result });
  });
});

router.post(
  "/send-group-message",
  (req, res, next) =>
    validateRequest(["users", "messageKey"], req.body, res, next),
  async (req, res) => {
    const { users, messageKey } = req.body;
    sendGroupMessage(users, messageKey);
    res.send({ success: true });
  }
);

export default router;
