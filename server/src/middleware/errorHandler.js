export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Not found.' });
}

// Express recognises error handlers by their four arguments, so "next" must stay here.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'The request body is not valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'The request is too large.' });
  }
  console.error('[server] Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong on our side. Please try again in a minute.',
  });
}
