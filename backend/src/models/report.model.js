import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalScan",
      required: true,
      unique: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Medical Scan Analysis Report",
    },

    findings: {
      type: String,
      required: true,
    },

    severityLevel: {
      type: String,
      enum: ["Invalid", "Normal", "Low", "Moderate", "High"],
      required: true,
    },

    detectedRegions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DetectedRegion",
      },
    ],

    doctorNotes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);