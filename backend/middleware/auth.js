// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Check if the token is in the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error in authentication middleware' });
  }
};

export default auth;
