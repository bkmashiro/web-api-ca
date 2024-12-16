import jwt from 'jsonwebtoken';
import User from '../api/users/userModel';

export class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const authenticate = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error('Bearer token not found');

    const decoded = await jwt.verify(token, process.env.SECRET);
    console.log(decoded);

    // Assuming decoded contains a username field
    const user = await User.findByUserName(decoded.username);
    if (!user) {
      throw new Error('User not found');
    }
    // Optionally attach the user to the request for further use
    request.user = user;
    next();
  } catch (err) {
    next(
      new AuthError('Authentication failed!', 401)
    );
  }
};

export const withAuth = (handler) => {
  return async (req, res, next) => {
    try {
      await authenticate(req, res, next);
      await handler(req, res);
    } catch (err) {
      res.status(401).send({ error: err.message });
    }
  };
}

export default authenticate;