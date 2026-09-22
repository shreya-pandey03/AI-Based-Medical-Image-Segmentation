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

Analyze the uploaded medical image carefully.

Selected scan type:
${scanType}

IMPORTANT RULES:

1. First determine whether the uploaded image is a real medical image.

2. Determine whether the image matches the selected scan type.

3. Reject these as invalid:
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

4. For a valid medical image:

"isMedicalImage": true

Perform a systematic visual examination of the entire image.

For the selected scan type, inspect for visible abnormalities such as:

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

5. IMPORTANT DETECTION RULE:

If you identify a visible abnormality, you MUST create an entry inside
"detectedRegions".

Each detected region must contain:

- label
- category
- confidenceScore
- box2d
- clinicalDescription

6. Bounding boxes:

Every abnormality must have a bounding box.

Coordinates must use this exact normalized 0-1000 format:

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

The bounding box must cover the visible abnormal area as accurately as possible.

7. Confidence:

confidenceScore must be a number between 0 and 1.

Example:

0.92

8. Severity:

Use:

"Normal"
"Low"
"Moderate"
"High"

Use "Normal" ONLY when no clinically relevant visible abnormality is identified.

Use "Low", "Moderate", or "High" when a visible abnormality is identified.

9. Do not automatically assume an image is normal.

Inspect the entire image before deciding.

10. Do not provide a diagnosis with certainty.

Describe only visible imaging findings.

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

    console.log("========== GEMINI RESULT ==========");
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("Gemini Vision API Error:", error);

    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};
