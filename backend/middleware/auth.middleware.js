import jwt from "jsonwebtoken";
import { ErrorClass } from "../core/index.js";

export const authAgent = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ErrorClass("Authentication required", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is an agent token (has role 'agent')
    if (decoded.role !== "agent") {
      throw new ErrorClass("Invalid token for agent access", 403);
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(new ErrorClass("Session expired, please login again", 401));
    } else if (error.name === "JsonWebTokenError") {
      next(new ErrorClass("Invalid authentication token", 401));
    } else {
      next(error);
    }
  }
};