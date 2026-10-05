import {Router} from "express"

import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

import {registerUser,
    userLogin,
    userLogout, 
    refreshAccessToken, 
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    deleteProfileImage,
    updateProfileImage,
    uploadProfileImage,
    getUserPatientsProfile
} from "../controllers/user.controller.js"

const router = Router();

// router.route("/register").post(upload.single("profileImage"),registerUser);


router.route("/register").post(upload.fields([{name:"profileImage",maxCount:1}]),registerUser);
router.route("/login").post(userLogin)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT,userLogout)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/upload-profileImage").post(verifyJWT,upload.single("profileImage"),uploadProfileImage);
router.route("/update-profileImage").patch(verifyJWT,upload.single("profileImage"),updateProfileImage)
router.route("/delete-profileImage").delete(verifyJWT,deleteProfileImage)
router.get("/patients-profile", verifyJWT, getUserPatientsProfile);

export default router
