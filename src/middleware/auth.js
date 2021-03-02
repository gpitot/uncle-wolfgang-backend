import { getUser } from "../queries/users/index";

const authenticateUser = (req, res, next) => {
  const { user } = req;
  console.log(user);
  if (user === undefined) {
    console.log("--------------- !!!!!!!!!!!!! req cookies : ", req.cookies);
    req.session.redirect = req.headers.preauthurl;
    console.log("setting session redirect to ", req.headers.preauthurl);
    return res.status(405).send("/auth/login/google");
  }
  next();
};

const authenticateAdmin = (req, res, next) => {
  const { user } = req;
  if (user === undefined) {
    req.session.redirect = req.headers.preauthurl;
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
