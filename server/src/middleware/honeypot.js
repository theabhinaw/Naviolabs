// The form has a hidden field called "website". Real visitors never see it, bots fill it in.
// When it is filled we reply "success" so the bot moves on, and we store nothing.
export function honeypot(req, res, next) {
  const trap = req.body && req.body.website;
  if (typeof trap === 'string' && trap.trim() !== '') {
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your audit request is received, we will contact you shortly.',
    });
  }
  return next();
}
