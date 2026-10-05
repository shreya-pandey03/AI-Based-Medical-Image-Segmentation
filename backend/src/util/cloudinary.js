import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import {ApiError} from "./apiError.js"

//Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY ? "FOUND" : "MISSING",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "FOUND" : "MISSING"
});

cloudinary.api.ping()
    .then((result) => {
        console.log("Cloudinary ping:", result);
    })
    .catch((error) => {
        console.error("Cloudinary ping failed:", error);
    });

export const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath){
            throw new ApiError(404,"File not found on local server");
        }

        console.log("Uploading file:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "image",
        });

        console.log("Cloudinary upload success:", response.secure_url);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response
    }catch(error){
        console.error("Cloudinary upload error:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            error: error.error,
            response: error.response,
            responseData: error.response?.data,
            responseHeaders: error.response?.headers
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        } 

        return null;
    }
}

export const deleteFromCloudinary = async(cloudinaryURL)=>{
    try{
        if(!cloudinaryURL) return null

        const publicIDwithExtension =  cloudinaryURL.split("/").pop();
        const publicId = publicIDwithExtension.split(".")[0]

        const response = await cloudinary.uploader.destroy(publicId)
        if(response?.result !== "ok"){
            throw new ApiError(500, "Failed to delete image")
        }
        return response
    }catch(error){
        console.error("Error while deleting the file from cloudinary")
        return null
    }
}