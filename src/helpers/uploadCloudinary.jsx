import CryptoJS from "crypto-js";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_NAME;
const API_KEY = import.meta.env.VITE_APP_CLOUDINARY_API_KEY;
const SECRET = import.meta.env.VITE_APP_CLOUDINARY_SECRET_KEY;

export const deleteFile = async (publicId, type = "image") => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = CryptoJS.SHA1(
    `public_id=${publicId}&timestamp=${timestamp}${SECRET}`
  ).toString();
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};
