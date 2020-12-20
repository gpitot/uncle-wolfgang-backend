const validateRequest = (args, data, res, next) => {
  for (let i = 0; i < args.length; i += 1) {
    if (data[args[i]] === undefined) {
      return res.status(300).send(`missing ${args[i]}`);
    }
  }
  return next();
};

export { validateRequest };
