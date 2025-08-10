import axios from 'axios';
import log from './logger';


export const uploadImageToAdrox = async (imageFile) => {
    try {
        log("Starting image upload to Adrox API...");
        log("File details:", {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
        });

        const formData = new FormData();
        formData.append("images", imageFile);

        // Log FormData contents for debugging
        log("FormData entries:");
        for (let pair of formData.entries()) {
            log(pair[0], pair[1]);
        }

        const response = await axios.post(
            // "https://adrox.ai/api/image-save",
            "https://next.fenizotechnologies.com/Adrox/api/image-save",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000, // 30 seconds timeout
            }
        );

        log("Upload response:", response);
        log("Response data:", response.data);

        if (
            response.data &&
            response.data.status === true &&
            response.data.message
        ) {
            log("Image uploaded successfully:", response.data.message);
            return response.data.message; // This is the URL
        } else {
            console.error("Unexpected response format:", response.data);
            throw new Error("Invalid response format from image upload API");
        }
    } catch (error) {
        console.error("Image upload error:", error);

        if (error.response) {
            console.error("Server error details:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
            throw new Error(
                `Upload failed: ${error.response.data?.message || error.response.statusText
                }`
            );
        } else if (error.request) {
            console.error("Network error - no response received:", error.request);
            throw new Error("Network error: Unable to reach the server");
        } else {
            console.error("Request setup error:", error.message);
            throw new Error(`Request error: ${error.message}`);
        }
    }
};