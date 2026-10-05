import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { DiagnosticReport } from "../models/diagnosticReport.model.js";
import { MedicalScan } from "../models/medicalScan.model.js";

const createReport = asyncHandler(async (req, res) => {
  const { scanId, doctorNotes, finalVerdict, reportPdfUrl } = req.body;

  if (!scanId) {
    throw new ApiError(400, "scanId is required to generate a report.");
  }

  const scan = await MedicalScan.findOne({
    _id: scanId,
    uploadedBy: req.user._id,
  });

  if (!scan) {
    throw new ApiError(404, "Medical scan not found or unauthorized.");
  }

  if (!scan.analysis) {
    throw new ApiError(400, "AI analysis is not available for this scan.");
  }

  const existingReport = await DiagnosticReport.findOne({
    scanId,
  });

  if (existingReport) {
    throw new ApiError(
      409,
      "A diagnostic report already exists for this scan.",
    );
  }

  const report = await DiagnosticReport.create({
    scanId,
    generatedBy: req.user._id,
    doctorNotes: doctorNotes || "",
    finalVerdict: finalVerdict || "Pending Review",
    reportPdfUrl: reportPdfUrl || "",
  });

  const populatedReport = await DiagnosticReport.findById(report._id)
    .populate({
      path: "scanId",
      populate: [
        {
          path: "patientId",
          select: "name age gender contactNumber medicalNotes",
        },
        {
          path: "analysis",
          populate: {
            path: "detectedRegions",
          },
        },
      ],
    })
    .populate("generatedBy", "fullName email specialization role");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedReport,
        "Diagnostic report created successfully.",
      ),
    );
});

const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await DiagnosticReport.findOne({
    _id: id,
    generatedBy: req.user._id,
  })
    .populate({
      path: "scanId",
      populate: [
        {
          path: "patientId",
          select: "name age gender contactNumber medicalNotes",
        },
        {
          path: "analysis",
          populate: {
            path: "detectedRegions",
          },
        },
      ],
    })
    .populate("generatedBy", "fullName email specialization role");

  if (!report) {
    throw new ApiError(404, "Diagnostic report not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Diagnostic report retrieved successfully."),
    );
});

const getDiagnosticReports = asyncHandler(async (req, res) => {
  const reports = await DiagnosticReport.find({
    generatedBy: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "scanId",
      select: "patientId scanType bodyPart imageUrl status analysis createdAt",
      populate: [
        {
          path: "patientId",
          select: "name age gender contactNumber",
        },
        {
          path: "analysis",
          populate: {
            path: "detectedRegions",
          },
        },
      ],
    })
    .populate("generatedBy", "fullName email specialization role");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reports,
        "Diagnostic reports retrieved successfully.",
      ),
    );
});

const updateDiagnosticReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { doctorNotes, finalVerdict, reportPdfUrl } = req.body;

  if (
    doctorNotes === undefined &&
    finalVerdict === undefined &&
    reportPdfUrl === undefined
  ) {
    throw new ApiError(
      400,
      "At least one field is required to update the report.",
    );
  }

  const report = await DiagnosticReport.findOneAndUpdate(
    {
      _id: id,
      generatedBy: req.user._id,
    },
    {
      $set: {
        ...(doctorNotes !== undefined && {
          doctorNotes,
        }),

        ...(finalVerdict !== undefined && {
          finalVerdict,
        }),

        ...(reportPdfUrl !== undefined && {
          reportPdfUrl,
        }),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate({
      path: "scanId",
      populate: [
        {
          path: "patientId",
          select: "name age gender contactNumber medicalNotes",
        },
        {
          path: "analysis",
          populate: {
            path: "detectedRegions",
          },
        },
      ],
    })
    .populate("generatedBy", "fullName email specialization role");

  if (!report) {
    throw new ApiError(404, "Diagnostic report not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Diagnostic report updated successfully."),
    );
});

const deleteDiagnosticReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await DiagnosticReport.findOneAndDelete({
    _id: id,
    generatedBy: req.user._id,
  });

  if (!report) {
    throw new ApiError(404, "Diagnostic report not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Diagnostic report deleted successfully."),
    );
});

export {
  createReport,
  getDiagnosticReports,
  getReportById,
  updateDiagnosticReport,
  deleteDiagnosticReport,
};
