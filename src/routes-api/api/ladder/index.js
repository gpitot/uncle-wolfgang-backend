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
  adminEditMatch,
  adminGetPendingAcceptedMatches,
  adminGetPendingBookingMatches,
  adminGetPendingResultsMatches,
  declineChallenge,
} from "../../../queries/ladder";
import { authenticateUser, authenticateAdmin } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

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
      player_1_name: req.user.firstname,
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
      player_2_name: req.user.firstname,
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
  "/challenge/decline",
  (req, res, next) => validateRequest(["match_id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    const player_2 = req.user.id;
    declineChallenge({
      ...req.body,
      player_2,
      player_2_name: req.user.firstname,
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

router.put(
  "/challenge/edit",
  (req, res, next) =>
    validateRequest(
      [
        "match_id",
        "match_date",
        "player_1_games",
        "player_2_games",
        "accepted",
        "declined",
      ],
      req.body,
      res,
      next
    ),
  authenticateAdmin,
  async (req, res) => {
    adminEditMatch(req.body)
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

router.get(
  "/awaitresults/:userid",
  (req, res, next) => validateRequest(["userid"], req.params, res, next),
  authenticateUser,
  async (req, res) => {
    getAwaitingResults({
      userid: req.params.userid,
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
  }
);

router.get("/admin/approvals", authenticateAdmin, async (req, res) => {
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

router.get("/admin/pending-accepted", authenticateAdmin, async (req, res) => {
  adminGetPendingAcceptedMatches()
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

router.get("/admin/pending-playing", authenticateAdmin, async (req, res) => {
  adminGetPendingBookingMatches()
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

router.get("/admin/pending-results", authenticateAdmin, async (req, res) => {
  adminGetPendingResultsMatches()
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
