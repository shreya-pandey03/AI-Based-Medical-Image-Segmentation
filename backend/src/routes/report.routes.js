import { Router } from "express";

import {
  createReport,
  getDiagnosticReports,
  getReportById,
  updateDiagnosticReport,
  deleteDiagnosticReport,
} from "../controllers/report.controller.js";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/create-report")
  .post(authorizeRoles("doctor", "radiologist", "admin"), createReport);

router.route("/").get(getDiagnosticReports);

router
  .route("/:id")
  .get(getReportById)
  .patch(
    authorizeRoles("doctor", "radiologist", "admin"),
    updateDiagnosticReport,
  )
  .delete(
    authorizeRoles("doctor", "radiologist", "admin"),
    deleteDiagnosticReport,
  );

export default router;
