import express from "express";
import {
  getUsersWithFreebieSession,
  usersByNumSocialSignups,
  getRecentlyCreatedUsers,
} from "../../../queries/admin";

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

// router.post("/send-social-reminders", async (req, res) => {
//
// });

export default router;
