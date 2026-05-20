/**
 * Role-Based Access Control middleware
 * Usage: checkRole(['admin', 'hr'])
 */
export const checkRole = (roles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Access denied — requires one of: ${roles.join(', ')}`);
  }
  next();
};
