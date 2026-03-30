/**
 * Mock Authentication Middleware
 * In production, this would verify JWT tokens from Authorization header.
 * For this system, we simulate a logged-in portal admin.
 */
const auth = (req, res, next) => {
  // Simulate authenticated portal admin
  req.admin = {
    id: 'portal-admin-001',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@collegeerp.in',
    role: 'superadmin',
  };
  next();
};

module.exports = auth;
