import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../util/apiError.js";
import { asyncHandler } from "../util/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Step 1: Extract the token from cookies or authorization header
  // Step 2: Validate whether token exists valid or not
  // Step 3: store the access token secret in the secret varaible
  // Step 4: Check whtehter secret exists in env or not
  // Step 5: now verify the token using jwt.verify
  // Step 6: using this decoded token now find the user by using decodedToken._id
  // Step 7: if user not found retrun new ApiError invalid token user no longer exists
  // Step 8: Attach user instance to request object
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      // return res.status(401).json({
      //     success: false,
      //     message: "Unauthorized request. No authentication token provided."
      // });
      throw new ApiError(
        401,
        "Unauthorized request. No authentication token provided.",
      );
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new ApiError(
        "FATAL ERROR: ACCESS_TOKEN_SECRET is not defined in environment variables.",
      );
    }
    // 2. Verify Token
    const decodedToken = jwt.verify(token, secret);

    // 3. Find User in DB (exclude password)
    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found. Invalid access Token");
    }

    // 4. Attach user instance to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || "Invalid or expired token.",
    });
  }
});

/*
Role-Based Authorization Middleware (Optional Helper)
To restrict certain actions (like approving diagnostic reports or deleting records) to verified doctors or admins, append this helper in the same file:
 */

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user?.role}) is not authorized.`,
      });
    }
    next();
  };
};

// because this is verification middleware file we are usng try catch inside asyncHandler because
// we want to generate our own api error message instead of the js library simple error message

// Why next() is used here and why it was showung error in the db connect file?
// Because DB connect file was not a express middleware file
// In express, sometimes there is chain of middlewares involved in executing the code
// For eg: middleware 1 → middleware 2 → middleware 3, Therefore next points to next middleware in express
// But connectDB is not a express middleware,its job is to  Connect application → MongoDB, here mongoose is used not express for the connection
