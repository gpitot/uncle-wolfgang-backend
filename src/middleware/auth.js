export default function (req, res, next) {
  if (req.body.password !== 'guillaume') {
    res.send('error');
  }
  next();
}
