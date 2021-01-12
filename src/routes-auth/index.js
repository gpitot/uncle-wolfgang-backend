import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/", (req, res) => {
  const { user } = req;
  res.send({ user });
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    //check if user is in users table and create user if not

    res.redirect("http://localhost:3001");
  }
);

export default router;
