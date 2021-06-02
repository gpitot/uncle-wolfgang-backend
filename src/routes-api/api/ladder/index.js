import express from "express";
import {
  getLadders,
  getMatches,
  getRanks,
  addChallenge,
  acceptChallenge,
  setMatchTime,
  submitResult,
  approveResult,
  signUp,
  getUpcomingMatches,
  getAwaitingResults,
  getAwaitingApprovals,
} from "../../../queries/ladder";
import { authenticateUser, authenticateAdmin } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";
import { sendMessage } from "../../../twilio-api";

const router = express.Router();

router.get("/", async (req, res) => {
  getLadders()
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch(() => {
      res.send({
        success: false,
      });
    });
});

router.get("/upcoming", async (req, res) => {
  getUpcomingMatches()
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch(() => {
      res.send({
        success: false,
      });
    });
});

router.get("/matches", async (req, res) => {
  getMatches(req.query)
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        success: false,
      });
    });
});

router.get("/:ladder_id/ranks", async (req, res) => {
  getRanks(req.params)
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch(() => {
      res.send({
        success: false,
      });
    });
});

router.post(
  "/:ladder_id/challenge",
  (req, res, next) =>
    validateRequest(
      ["ladder_id", "player_2"],
      {
        ...req.body,
        ...req.params,
      },
      res,
      next
    ),
  authenticateUser,
  async (req, res) => {
    const player_1 = req.user.id;
    addChallenge({
      ...req.body,
      ...req.params,
      player_1,
    })
      .then((result) => {
        res.send({
          success: true,
          result,
        });
        //send sms
      })
      .catch((err) => {
        console.log(err);
        res.send({
          err,
          success: false,
        });
      });
  }
);

router.put(
  "/challenge/accept",
  (req, res, next) => validateRequest(["match_id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    const player_2 = req.user.id;
    acceptChallenge({
      ...req.body,
      player_2,
    })
      .then((result) => {
        res.send({
          success: result,
        });
      })
      .catch(() => {
        res.send({
          success: false,
        });
      });
  }
);

router.put(
  "/challenge/time",
  (req, res, next) =>
    validateRequest(["match_id", "time"], req.body, res, next),
  authenticateAdmin,
  async (req, res) => {
    setMatchTime(req.body)
      .then((result) => {
        res.send({
          success: true,
          result,
        });
      })
      .catch(() => {
        res.send({
          success: false,
        });
      });
  }
);

router.put(
  "/challenge/result",
  (req, res, next) =>
    validateRequest(
      ["match_id", "player_1_games", "player_2_games"],
      req.body,
      res,
      next
    ),
  authenticateUser,
  async (req, res) => {
    const userid = req.user.id;
    submitResult({ ...req.body, userid })
      .then((result) => {
        res.send({
          success: true,
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
        });
      });
  }
);

/*
match_id, ladder_id, winner, loser 
*/

/*
later on let the 2nd player approve the 1st player result
*/
router.put(
  "/challenge/approve",
  (req, res, next) => validateRequest(["match_id"], req.body, res, next),
  authenticateAdmin,
  async (req, res) => {
    approveResult(req.body)
      .then((result) => {
        res.send({
          success: true,
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
        });
      });
  }
);

router.post(
  "/signup",
  (req, res, next) => validateRequest(["ladder_id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    const player_id = req.user.id;
    signUp({ ...req.body, player_id })
      .then(() => {
        res.send({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
        });
      });
  }
);

router.get("/awaitresults", authenticateUser, async (req, res) => {
  const userid = req.user.id;
  getAwaitingResults({
    userid,
  })
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        success: false,
      });
    });
});

router.get("/awaitapprovals", authenticateAdmin, async (req, res) => {
  getAwaitingApprovals()
    .then((result) => {
      res.send({
        success: true,
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        success: false,
      });
    });
});

export default router;
