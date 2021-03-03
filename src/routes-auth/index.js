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
    failureRedirect: `${process.env.SITE_URL}/loginerror`,
  }),
  (req, res) => {
    //update or add user
    const { user, cookies, session } = req;
    const redirectTo = session.redirect ? session.redirect : "/";
    delete session.redirect;
    console.log("---------------------------------");
    console.log(cookies);
    console.log("REDIRECT TO : ", redirectTo);
    console.log("---------------------------------");
    const redirectUrl = `${process.env.SITE_URL}${redirectTo}?cookie=${cookies["connect.sid"]}`;
    //const redirectUrl = `${process.env.SITE_URL}${redirectTo}`;
    res.cookie("authCookie", cookies["connect.sid"], {
      maxAge: 90000,
      httpOnly: true,
    });
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
          .catch((err) => {
            console.log("loginerror");
            console.log(err);
            res.redirect(`${process.env.SITE_URL}/loginerror`);
          });
      });
  }
);

export default router;
