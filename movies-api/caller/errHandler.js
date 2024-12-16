const defaultErrHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }

  const code = err.code || 500;

  res.status(code).send({
    message: err.message,
    stack: err.stack,
    code: err.code,
  });
};

export default defaultErrHandler;