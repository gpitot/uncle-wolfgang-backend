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
    console.log("---------------------------------");
    console.log(cookies);
    console.log("---------------------------------");
    const redirectUrl = `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`;
    getUser(user)
      .then(() => {
        //update user
        updateUser({ user })
          .then(() => {
            res.redirect(redirectUrl);
          })
          .catch(() => {
            res.redirect(redirectUrl);
          });
      })
      .catch(() => {
        //create user
        console.log("adding a user");
        addUser({ user })
          .then(() => res.redirect(redirectUrl))
          .catch(() => res.redirect(redirectUrl));
      });
  }
);

export default router;
