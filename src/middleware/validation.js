const validateRequest = (args, data, res, next) => {
  for (let i = 0; i < args.length; i += 1) {
    if (data[args[i]] === undefined) {
      return res.status(400).send({
        success: false,
        message: `Missing ${args[i]}`,
      });
    }
  }
  return next();
};

export { validateRequest };
