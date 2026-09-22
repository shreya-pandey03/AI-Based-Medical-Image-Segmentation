import { Router } from "express";
import {
  uploadAndAnalyzeScan,
  getScanById,
  verifyDetectedRegion,
  deleteScan
} from "../controllers/medicalScan.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all scan routes
router.use(verifyJWT);

// Upload & Analyze scan
//outer.post("/analyze", upload.single("scanImage"), uploadAndAnalyzeScan);
router.route("/analyze").post(upload.single("scanImage"), uploadAndAnalyzeScan)
// Retrieve and Delete by ID
router.route("/:id")
  .get(getScanById)
  .delete(deleteScan);

// Doctor verification on bounding box
router.patch(
  "/:id/verify-region",
  authorizeRoles("doctor", "radiologist", "admin"),
  verifyDetectedRegion
);

export default router;