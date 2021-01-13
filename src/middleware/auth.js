import { getUser } from "../queries/users/index";

const authenticateUser = (req, res, next) => {
  const { user } = req;
  if (user === undefined) {
    return res.status(405).send("/auth/login/google");
  }
  const { id } = user;
  getUser({ id })
    .then(() => {
      next();
    })
    .catch(() => {
      return res.status(405).send("/auth/login/google");
    });
};

const authenticateAdmin = (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res.status(405).send("/auth/login/google");
  }
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
