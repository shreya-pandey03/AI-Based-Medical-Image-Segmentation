import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../util/cloudinary.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // returns true or false
  // if in .enc file if you have assign it value "development", then from your local laptop this alllows you work from that
  // if its production then And the browser will only send the cookie over HTTPS.
  sameSite: "strict",
};
/*
So each option protects against a different type of problem:

Option	Main purpose
httpOnly: true	Prevent browser JavaScript from reading the cookie
secure: true	Send cookie only over HTTPS
sameSite: "strict"	Restrict cross-site cookie sending
 */

const registerUser = asyncHandler(async (req, res) => {
  // Step 1) Extract all the details from the req.body
  // Step 2) Validate all the required details, if any one of them is empty throw apiError
  // Step 3) By using email or username, check whether the user exists or not
  // Step 4) If yes, then throw new apiError
  // Step 5) generate the profile image local path
  // Step 6) Now by user.create create the user
  // Step 7) If user is not created successfully then throw 500 api Error
  // Step 8) return res

  const { username, email, password, fullName, role, specialization } =
    req.body;

  if ([username, email, password, fullName].some((field) => !field?.trim())) {
    throw new ApiError(400, "User related fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let profileImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.profileImage) &&
    req.files.profileImage.length > 0
  ) {
    profileImageLocalPath = req.files.profileImage[0].path;
  }

  // As profile image is not required field we are not returning any api error

  let profileImage = null;

  if (profileImageLocalPath) {
    profileImage = await uploadOnCloudinary(profileImageLocalPath);
  }

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    role,
    specialization,
    profileImage: profileImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Database connection error, error creating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const generateAccessandRefreshToken = async (userId) => {
  // Step 1: Validate user ID
  // Step 2: Find the user
  // Step 3: generate accessToken
  // Step 4: generate refreshToken
  // Step 5: save the refresh token in user.refreshToken
  // Step 6: now use user.save("validate brfore save:true")
  // Step 7: now return accessToken and refreshToken

 try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN GENERATION ERROR:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const userLogin = asyncHandler(async (req, res) => {
  // Step 1) receive the username,email and password from req.body
  // Step 2) now validate the username and password, whether they are empty or not
  // Step 3) using username check whether user exists or ont
  // Step 4) validate the incoming password whether the password is correct or not using user.isPaaswordCorrect()
  // Step 5) if not then throw api error
  // Step 6) now create a loogedIN user by using user.findbyid and use the user not User
  // Step 7) if cannot find loggedIN user throw new api error
  // Step 8) return response

  const { username, email, password } = req.body;

  if (!(username || email) || !password) {
    throw new ApiError(404, "Username or password required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user password");
  }

  const { refreshToken, accessToken } = await generateAccessandRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken",
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from the document
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Step 1: Store the incoming refresh token from req.cookies or req.body(Note: authorization header was used in verify hwt only)
  // Step 2: if no incoming refresh token throw new ApiError
  // Step 3: verify the incoming refresh token with stored token in env and store it in decoded token
  // Step 4: find user using that decoded token._id
  // Step 5: matching step, match the incoming refresh token with refresh stored in user document in mongo db
  // Step 6: if they doesnt match throw new api error
  // Step 7: now generate new tokens using generate tokens functions and generate new refresh token
  // Step 8: return the res

  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(404, "Unauthorized request, missing refresh token");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Refresh Token expired or used");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(),
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed",
        "Access token refreshed",
      );
  } catch (error) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Step 1: Recieve the oldPassword and newPassword from the user
  // Step 2: find the user using req.user
  // Step 3: using isPasswordCorrrect method of user, check whether the old password is correct or not
  // Step 4: save the new paasword then in user.password
  // Step 5: run await save (validateBeforeSave:false)
  // Step 6: return the response
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old password and new passsword are required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordValid) {
    throw new ApiError(401, "The old password you enterd is not correct.");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // Step 1: Destructure the username, email, fullName received from the req.body
  // Step 2: check whetehr ther are empty ?
  // Step 3: using username and email find whether the user already exists or not
  // Step 4: if user already exists then check which field matches the existing user and throw api error
  // Step 5: if user with this email or username does not  exists then update the user wiht these new fileds
  // Step 6: return the response

  const { username, fullName, email } = req.body;

  if (!username || !fullName || !email) {
    throw new ApiError(404, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username: username.toLowerCase() }],
    _id: {
      $ne: req.user._id,
    },
    // ne stands for not equal
  });

  if (userExists) {
    if (userExists.email === email) {
      throw new ApiError(409, "Email is already in use");
    }

    if (userExists.username === username.toLowerCase()) {
      throw new ApiError(409, "Username is already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        username: username,
        email: email,
      },
    },
    { new: true },
  ).select(" -password -refreshToken ");

  return res
    .status(201)
    .json(
      new ApiResponse(201, updatedUser, "Account details updated successfully"),
    );
});

const deleteProfileImage = asyncHandler(async (req, res) => {
  // Step 1: check whether the user has a profile image or not
  // Step 2: if not then throw api error that user does not have any profile image to delete
  // Step 3: if it have then then store the url in old profile Image
  // Step 4: Now use delete form cloudinary from cloudinary utility file
  // Step 5: Update the user
  // Step 6; return the response

  const oldProfileImage = req.user?.profileImage;
  // why the ? is used here/
  // it is used if user is not found then return undefined, dont throw a error
  // if we dont use ?, and user is not found then it will throw an erroe

  if (!oldProfileImage) {
    throw new ApiError(404, "User does not have any profile image to delete");
  }

  const deleteImage = await deleteFromCloudinary(oldProfileImage);

  if (!deleteImage) {
    throw new ApiError(
      500,
      "Cloudinary services error while deleting the old Profile Image",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        profileImage: "",
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(
      500,
      "Error while delting the refrence of the profile image from database",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile Image deleted successfully"),
    );
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const newProfileImagePath = req.file?.path;
  // this req.file is provided by multer middleware

  if (!newProfileImagePath) {
    throw new ApiError(404, "New profile image is missing");
  }

  const oldProfileImage = req.user?.profileImage;

  const newProfileImage = await uploadOnCloudinary(newProfileImagePath);

  if (!newProfileImage) {
    throw new ApiError(
      500,
      "Error while uploading the new peofile image to cloudinary",
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: newProfileImage.url,
      },
    },
    { new: true },
  ).select(" -password -refreshToken");

  if (!user) {
    throw new ApiError(
      500,
      "Error while storing the refrence(url) of the new profile image in database",
    );
  }

  if (oldProfileImage) {
    await deleteFromCloudinary(oldProfileImage);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile image updated successfully"));
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  // Step 1: Check whether the user has profile image or not
  // Step 2: If the user already has profile image then he must delete that first or use update option instead
  // Step 3: using req.file form multer store the Profile Image path
  // Step 4: If the path doesnt exist throw error
  // Step 5: using that profile image path the upload the image on cloudinary
  // Step 6: if cloudinary service fails throw an error
  // Step 7: update the user
  // Step 8 return the res

  const profileImageAlreadyeExists = req.user?.profileImage;

  if (profileImageAlreadyeExists) {
    throw new ApiError(
      409,
      "Profile image already existing, delete the existing image or instead of deleting the profile image use update profile image option",
    );
  }

  const profileImagePath = req.file?.path;

  if (!profileImagePath) {
    throw new ApiError(404, "Profile image not found");
  }

  const profileImage = await uploadOnCloudinary(profileImagePath);
  if (!profileImage) {
    throw new ApiError(500, "Cloudinary service error");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: profileImage.url,
      },
    },
    { new: true },
  ).select(" -password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Database error while uploading profile image");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile Image uploaded successfully"));
});

const getUserPatientsProfile = asyncHandler(async (req, res) => {
  console.log(">>> getUserPatientsProfile hit! Logged in user:", req.user?._id);
  const userId = req.user._id;

  const userPateintProfile = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "patients",
        localField: "_id",
        foreignField: "doctorId",
        as: "patients",
        pipeline: [
          // Nested lookup to fetch medical scans for each patient
          {
            $lookup: {
              from: "medicalscans",
              localField: "_id",
              foreignField: "patientId",
              as: "scans",
              pipeline: [
                {
                  $project: {
                    scanType: 1,
                    bodyPart: 1,
                    imageUrl: 1,
                    status: 1,
                    "analysis.overallFindings": 1,
                    "analysis.severityLevel": 1,
                    createdAt: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              totalScans: { $size: "$scans" },
            },
          },
        ],
      },
    },
    // 3. Compute summary statistics
    {
      $addFields: {
        totalPatients: { $size: "$patients" },
      },
    },

    // 4. Project clean output schema
    {
      $project: {
        fullName: 1,
        email: 1,
        role: 1,
        specialization: 1,
        profileImage: 1,
        totalPatients: 1,
        patients: 1,
      },
    },
  ]);

  if (!userPateintProfile || userPateintProfile.length === 0) {
    throw new ApiError(404, "User profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPateintProfile[0],
        "Doctor patients profile fetched successfully",
      ),
    );
});

export {
  registerUser,
  userLogin,
  userLogout,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  deleteProfileImage,
  updateProfileImage,
  uploadProfileImage,
  getUserPatientsProfile,
};
