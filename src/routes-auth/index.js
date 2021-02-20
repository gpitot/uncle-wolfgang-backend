import express from "express";
import passport from "passport";

import { addUser, updateUser, getUser } from "../queries/users";

const router = express.Router();

router.get("/", (req, res) => {
  const { user } = req;
  res.send({ user });
});

router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    //update or add user
    const { user, cookies, session } = req;
    const redirectTo = session.redirect ? session.redirect : "/";
    console.log("redirecting to this ", redirectTo);

    getUser(user)
      .then(() => {
        //update user
        updateUser({ user })
          .then(() => {
            res.redirect(
              `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`
            );
          })
          .catch(() => {
            res.redirect(
              `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`
            );
          });
      })
      .catch(() => {
        //create user
        console.log("adding a user");
        addUser({ user })
          .then(() =>
            res.redirect(
              `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`
            )
          )
          .catch(() =>
            res.redirect(
              `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`
            )
          );
      });
  }
);

export default router;
