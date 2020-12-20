export default function (req, res, next) {
  if (req.header("authorization") !== "guillaume") {
    return res.status(200).send("Auth error");
  }
  next();
}
