import express from "express";
import passport from "passport";

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
    const redirectTo = req.session.redirectTo ? req.session.redirectTo : "/";
    res.redirect(`${process.env.SITE_URL}${redirectTo}?updatelogin=true`);
  }
);

export default router;
