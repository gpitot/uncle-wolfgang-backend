import jwt from "jsonwebtoken";
// eslint-disable-next-line import/no-commonjs
require("dotenv").config();
const { SESSION_SECRET } = process.env;

const authenticateUser = (req, res, next) => {
  authenticateJWT(req, res, next);
};

const authenticateAdmin = (req, res, next) => {
  authenticateJWT(req, res, next, true);
};

const authenticateJWT = (req, res, next, admin = false) => {
  const authHeader = req.headers.authorization;
  const userCheck = req.headers.usercheck;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SESSION_SECRET, (err, user) => {
      if (err) {
        if (userCheck) {
          return res.send({
            success: false,
          });
        }
        return res.sendStatus(403);
      }

      req.user = user;
      if (admin) {
        if (!isAdmin(user)) {
          return res.sendStatus(403);
        }
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const isAdmin = (user) => {
  return user.role === "admin" || user.role === "superman";
};

export { authenticateAdmin, authenticateUser, isAdmin };
