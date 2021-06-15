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

const authenticateSuperman = (req, res, next) => {
  authenticateJWT(req, res, next, true, true);
};

const authenticateJWT = (req, res, next, admin = false, superman = false) => {
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

      if (superman) {
        if (!isSuperman(user)) {
          return res.sendStatus(403);
        }
      }

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

const isSuperman = (user) => {
  return user.role === "superman";
};

export { authenticateSuperman, authenticateAdmin, authenticateUser, isAdmin };
