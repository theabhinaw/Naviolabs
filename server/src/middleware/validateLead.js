import { leadSchema } from '../validators/leadSchema.js';

export function validateLead(req, res, next) {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return res.status(400).json({
      success: false,
      message: 'Please check the highlighted fields.',
      errors,
    });
  }
  req.validated = result.data;
  return next();
}
