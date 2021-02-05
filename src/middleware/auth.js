import { getUser } from "../queries/users/index";
import passport from "passport";

const authenticateUser = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
  next();
};

const authenticateAdmin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
  const { user } = req;
  const { id } = user;
  getUser({ id })
    .then((res) => {
      if (res.role === "admin" || res.role === "superman") {
        next();
      } else {
        res.status(400).send("Auth error");
      }
    })
    .catch(() => {
      return res.status(405).send("/auth/login/google");
    });
};

export { authenticateAdmin, authenticateUser };
