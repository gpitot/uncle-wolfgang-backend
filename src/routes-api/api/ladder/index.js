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

router.get("/:ladder_id/matches", async (req, res) => {
  getMatches({
    ...req.params,
    ...req.query,
  })
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
      ["ladder_id", "player_2", "challenge_date"],
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
      })
      .catch(() => {
        res.send({
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
    const player_1 = req.user.id;
    submitResult({ ...req.body, player_1 })
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

/*
match_id, ladder_id, winner, loser 
*/
router.put(
  "/challenge/approve",
  (req, res, next) =>
    validateRequest(
      ["match_id", "ladder_id", "winner", "loser"],
      req.body,
      res,
      next
    ),
  authenticateAdmin,
  async (req, res) => {
    approveResult(req.body)
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

export default router;
