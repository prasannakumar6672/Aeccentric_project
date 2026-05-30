/**
 * Role-Based Access Control middleware
 * Usage: checkRole('admin', 'hr') or checkRole(['admin', 'hr'])
 */
export const checkRole = (...allowedRoles) => (req, res, next) => {
  const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
  if (!req.user) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    res.status(401);
    return next(error);
  }
  if (!roles.includes(req.user.role)) {
    const error = new Error(`Access denied — requires one of: ${roles.join(', ')}`);
    error.statusCode = 403;
    res.status(403);
    return next(error);
  }
  next();
};
