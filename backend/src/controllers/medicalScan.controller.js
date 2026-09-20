import {MedicalScan} from "../models/medicalScan.model.js"
import {ApiError} from "../util/apiError.js"
import {ApiResponse} from "../util/apiResponse.js"
import {asyncHandler} from "../util/asyncHandler.js"
import { analyzeMedicalImageWithGemini } from "../services/gemini.service.js"
import { Patient } from "../models/patient.model.js"
import {uploadOnCloudinary} from "../util/cloudinary.js"
import {DetectedRegion} from "../models/detectedRegion.model.js"
import { AIanalysis } from "../models/AiAnalysis.model.js"

// 1. Upload scan image, trigger Gemini analysis, save to Cloudinary & DB
const uploadAndAnalyzeScan = asyncHandler(async (req, res) => {
    const { patientId, scanType, bodyPart } = req.body;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Medical scan image file is required.");
    }

    if (!scanType) {
        throw new ApiError(400, "Scan type is required.");
    }

    if (patientId) {
        const patientExists = await Patient.findById(patientId);
        if (!patientExists) {
        throw new ApiError(404, "Specified patient does not exist.");
        }
    }

    // A. Trigger Gemini Vision multimodal analysis
    const aiFindings = await analyzeMedicalImageWithGemini(
        imageLocalPath,
        req.file.mimetype,
        scanType
    );

    // B. Upload scan to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath, "medical_scans");

    if (!cloudinaryResponse?.secure_url) {
        throw new ApiError(500, "Failed to upload medical scan image to cloud storage.");
    }

    // C. Map detected regions to match your schema's { ymin, xmin, ymax, xmax }
    let savedRegionIds = [];
    if (Array.isArray(aiFindings.detectedRegions) && aiFindings.detectedRegions.length > 0) {
        const formattedRegions = aiFindings.detectedRegions.map((region) => {
        // Handle both array format [ymin, xmin, ymax, xmax] or pre-mapped object
        const box = Array.isArray(region.box2d)
            ? {
                ymin: region.box2d[0],
                xmin: region.box2d[1],
                ymax: region.box2d[2],
                xmax: region.box2d[3]
            }
            : region.box2d;

        return {
            label: region.label || "Anomaly",
            category: region.category || "Anomaly",
            confidenceScore: region.confidenceScore || region.confidence || 1.0,
            box2d: box,
            clinicalNote: region.clinicalDescription || region.clinicalNote || "",
            color: region.color || "#FF3B30"
        };
        });

        const regionDocs = await DetectedRegion.insertMany(formattedRegions);
        savedRegionIds = regionDocs.map((doc) => doc._id);
    }

    // D. Create AIanalysis document
    const aiAnalysisDoc = await AIanalysis.create({
        overallFindings: aiFindings.overallFindings || "No acute abnormalities detected.",
        severityLevel: ["Normal", "Low", "Moderate", "High"].includes(aiFindings.severityLevel)
        ? aiFindings.severityLevel
        : "Normal",
        detectedRegions: savedRegionIds,
        rawApiResponse: aiFindings
    });

    // E. Create MedicalScan document referencing AIanalysis
    const medicalScan = await MedicalScan.create({
        patientId: patientId || null,
        uploadedBy: req.user._id,
        scanType,
        bodyPart: bodyPart || "General",
        imageUrl: cloudinaryResponse.secure_url,
        status: "completed",
        analysis: aiAnalysisDoc._id
    });

    // F. Return fully populated scan
    const populatedScan = await MedicalScan.findById(medicalScan._id)
        .populate({
        path: "analysis",
        populate: {
            path: "detectedRegions"
        }
        })
        .populate("patientId", "patientName age gender")
        .populate("uploadedBy", "fullName email role specialization");

    return res.status(201).json(
        new ApiResponse(201, populatedScan, "Scan analyzed and saved successfully.")
    );
});
// 2. Get scan by ID

const getScanById = asyncHandler(async(req,res)=>{
    const { id } = req.params;

    const scan = await MedicalScan.findById(id)
        .populate({
        path: "analysis",
        populate: {
            path: "detectedRegions"
        }
        })
       .populate("patientId", "name age gender contactNumber")
        .populate("uploadedBy", "fullName email role specialization");

    if (!scan) {
        throw new ApiError(404, "Medical scan not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, scan, "Medical scan details fetched successfully.")
    );
})


// 3. Update doctor feedback & verification on specific bounding box
const verifyDetectedRegion = asyncHandler(async (req, res) => {
    const { regionId } = req.params;
    const { isDoctorVerified, doctorFeedback, clinicalNote } = req.body;

    const region = await DetectedRegion.findByIdAndUpdate(
        regionId,
        {
        $set: {
            ...(typeof isDoctorVerified === "boolean" && { isDoctorVerified }),
            ...(doctorFeedback !== undefined && { doctorFeedback }),
            ...(clinicalNote !== undefined && { clinicalNote })
        }
        },
        { new: true, runValidators: true }
    );

    if (!region) {
        throw new ApiError(404, "Detected region record not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, region, "Region verification updated successfully.")
    );
});
// 4. Delete a scan record
const deleteScan = asyncHandler(async(req,res)=>{
    const { id } = req.params;

    const scan = await MedicalScan.findById(id);
    if (!scan) {
        throw new ApiError(404, "Medical scan not found.");
    }

    if (scan.analysis) {
        const analysisDoc = await AIanalysis.findById(scan.analysis);
        if (analysisDoc) {
        if (analysisDoc.detectedRegions?.length > 0) {
            await DetectedRegion.deleteMany({ _id: { $in: analysisDoc.detectedRegions } });
        }
        await AIanalysis.findByIdAndDelete(scan.analysis);
        }
    }

    await MedicalScan.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Medical scan and associated analysis records deleted successfully.")
    );
})

export {
    uploadAndAnalyzeScan,
    getScanById,
    verifyDetectedRegion,
    deleteScan
}