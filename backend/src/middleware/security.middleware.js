const dangerousKeyPattern = /(^\$)|(\.)/;

const assertSafeKeys = (value, path = 'payload') => {
  if (!value || typeof value !== 'object') return;

  for (const key of Object.keys(value)) {
    if (dangerousKeyPattern.test(key)) {
      const error = new Error(`Invalid key in ${path}`);
      error.statusCode = 400;
      throw error;
    }
    assertSafeKeys(value[key], `${path}.${key}`);
  }
};

export const rejectMongoOperatorKeys = (req, _res, next) => {
  try {
    assertSafeKeys(req.body, 'body');
    assertSafeKeys(req.params, 'params');
    assertSafeKeys(req.query, 'query');
    next();
  } catch (error) {
    next(error);
  }
};
