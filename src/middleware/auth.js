import { getUser } from "../queries/users/index";

const authenticateUser = (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect("/auth/login/google");
  }
  const { id } = user;
  getUser({ id })
    .then(() => {
      next();
    })
    .catch(() => {
      res.redirect("/auth/login/google");
    });
};

const authenticateAdmin = (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect("/auth/login/google");
  }
  const { id } = user;
  getUser({ id })
    .then((res) => {
      if (res.role === "admin") {
        next();
      } else {
        res.status(400).send("Auth error");
      }
    })
    .catch(() => {
      res.redirect("/auth/login/google");
    });
};

export { authenticateAdmin, authenticateUser };
