import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType: mimeType || "image/jpeg",
    },
  };
};

export const analyzeMedicalImageWithGemini = async (
  localFilePath,
  mimeType,
  scanType = "Chest X-Ray",
) => {
  try {
    const imagePart = fileToGenerativePart(localFilePath, mimeType);

    const prompt = `
You are an AI medical image analysis assistant.

Analyze the uploaded medical image carefully and consistently.

Selected scan type:
${scanType}

IMPORTANT RULES:

1. IMAGE VALIDATION

First determine whether the uploaded image is a real medical image.

Reject:

- screenshots
- file explorers
- desktop screenshots
- UI screenshots
- documents
- unrelated photographs
- non-medical images

For an invalid image:

"isMedicalImage": false
"severityLevel": "Invalid"
"detectedRegions": []

Explain why it is invalid in "overallFindings".

2. SCAN TYPE

Determine whether the image matches the selected scan type.

If the image does not match the selected scan type, treat it as invalid.

3. MEDICAL IMAGE ANALYSIS

For a valid medical image:

"isMedicalImage": true

Systematically inspect the entire image.

Look for clearly visible abnormalities relevant to the selected scan type, including:

- fractures
- dislocations
- abnormal joint spaces
- bone abnormalities
- lesions
- masses
- consolidation
- infiltrates
- opacities
- nodules
- degenerative changes
- abnormal alignment
- soft tissue abnormalities
- other clearly visible abnormalities

Do not invent findings.

Only report abnormalities that are visually supported by the image.

Do not diagnose conditions with certainty.

Describe imaging findings rather than making unsupported clinical diagnoses.

4. CONSISTENCY

Analyze the actual image evidence.

Do not randomly change findings between analyses.

If the same visible abnormality is present in the image, report it consistently.

Do not add an abnormality merely because a similar abnormality could theoretically exist.

Do not remove an abnormality merely because the image is being analyzed again.

5. DETECTED REGIONS

If a visible abnormality is identified, create a corresponding entry in "detectedRegions".

Each detected region MUST contain:

- label
- category
- confidenceScore
- box2d
- clinicalDescription

Every detected abnormality must have a bounding box.

6. BOUNDING BOX FORMAT

Coordinates MUST use normalized 0-1000 coordinates.

ymin = top
xmin = left
ymax = bottom
xmax = right

Example:

{
  "ymin": 200,
  "xmin": 300,
  "ymax": 500,
  "xmax": 700
}

The bounding box must cover the visible abnormal area.

Do not create a bounding box for an area where there is no visible abnormality.

7. CONFIDENCE

confidenceScore must be between 0 and 1.

The confidence score must reflect the visual evidence.

Do not use arbitrary confidence values.

8. SEVERITY

Allowed values:

"Invalid"
"Normal"
"Low"
"Moderate"
"High"

Use "Normal" ONLY when no clinically relevant visible abnormality is identified.

If a visible abnormality is identified, use Low, Moderate, or High based on the apparent severity of the visible finding.

9. NORMAL IMAGE

If the image is valid and no clinically relevant abnormality is clearly visible:

"isMedicalImage": true
"severityLevel": "Normal"
"detectedRegions": []

Do not create artificial detections just to populate the detectedRegions array.

10. FINAL CHECK

Before returning the result:

- Verify that every detected region corresponds to a visible finding.
- Verify every detected region has a valid bounding box.
- Verify xmin < xmax.
- Verify ymin < ymax.
- Verify all coordinates are between 0 and 1000.
- Verify confidenceScore is between 0 and 1.
- Verify severityLevel matches the findings.
- If there are no supported abnormalities, return an empty detectedRegions array.

Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        imagePart,
        {
          text: prompt,
        },
      ],

      config: {
        temperature: 0,

        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            isMedicalImage: {
              type: Type.BOOLEAN,
            },

            overallFindings: {
              type: Type.STRING,
            },

            severityLevel: {
              type: Type.STRING,
              enum: ["Invalid", "Normal", "Low", "Moderate", "High"],
            },

            detectedRegions: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  label: {
                    type: Type.STRING,
                  },

                  category: {
                    type: Type.STRING,
                  },

                  confidenceScore: {
                    type: Type.NUMBER,
                  },

                  box2d: {
                    type: Type.OBJECT,

                    properties: {
                      ymin: {
                        type: Type.NUMBER,
                      },

                      xmin: {
                        type: Type.NUMBER,
                      },

                      ymax: {
                        type: Type.NUMBER,
                      },

                      xmax: {
                        type: Type.NUMBER,
                      },
                    },

                    required: ["ymin", "xmin", "ymax", "xmax"],
                  },

                  clinicalDescription: {
                    type: Type.STRING,
                  },
                },

                required: [
                  "label",
                  "category",
                  "confidenceScore",
                  "box2d",
                  "clinicalDescription",
                ],
              },
            },
          },

          required: [
            "isMedicalImage",
            "overallFindings",
            "severityLevel",
            "detectedRegions",
          ],
        },
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(text);

    if (!Array.isArray(result.detectedRegions)) {
      result.detectedRegions = [];
    }

    result.detectedRegions = result.detectedRegions.filter((region) => {
      const box = region?.box2d;

      if (!box) {
        return false;
      }

      const ymin = Number(box.ymin);
      const xmin = Number(box.xmin);
      const ymax = Number(box.ymax);
      const xmax = Number(box.xmax);
      const confidence = Number(region.confidenceScore);

      return (
        Number.isFinite(ymin) &&
        Number.isFinite(xmin) &&
        Number.isFinite(ymax) &&
        Number.isFinite(xmax) &&
        ymin >= 0 &&
        ymin <= 1000 &&
        xmin >= 0 &&
        xmin <= 1000 &&
        ymax >= 0 &&
        ymax <= 1000 &&
        xmax >= 0 &&
        xmax <= 1000 &&
        ymin < ymax &&
        xmin < xmax &&
        Number.isFinite(confidence) &&
        confidence >= 0 &&
        confidence <= 1
      );
    });

    console.log("GEMINI RESULT:");
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("Gemini Vision API Error:", error);

    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};
