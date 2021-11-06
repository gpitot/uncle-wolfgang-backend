import express from "express";
import {
  recalculateAllStreaks,
  usersWithNoSocialSignups,
  usersWithMostSocialSignups,
  getRecentlyCreatedUsers,
} from "../../../queries/admin";

const router = express.Router();

router.get("/recalculate-streaks", async (req, res) => {
  recalculateAllStreaks().then((success) => {
    res.send({ success });
  });
});

router.get("/most-social-signups", async (req, res) => {
  usersWithMostSocialSignups().then((result) => {
    res.send({ success: true, result });
  });
});

router.get("/no-social-signups", async (req, res) => {
  usersWithNoSocialSignups().then((result) => {
    res.send({ success: true, result });
  });
});

router.get("/recently-created-users", async (req, res) => {
  getRecentlyCreatedUsers().then((result) => {
    res.send({ success: true, result });
  });
});

//router.get("/send-social-reminders", async (req, res) => {});

export default router;
