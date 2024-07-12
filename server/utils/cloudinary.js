import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      overwrite: false,
      unique_filename: true,
      use_filename: true,
      folder: "uploads",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(`Error while uploading :: ${error}`);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteImagesFromCloudinary = async (imagesArray) => {
  try {
    if (!imagesArray?.length) return null;
    let urlsWithoutExtension = [];
    imagesArray.forEach(async (item) => {
      let splittedUrl = item.split("/");
      let folderName = splittedUrl[splittedUrl.length - 2];
      const filePath = splittedUrl[splittedUrl.length - 1];

      const lastDotIndex = filePath.lastIndexOf(".");
      const fileNameWithoutExtension =
        lastDotIndex !== -1 ? filePath.substring(0, lastDotIndex) : filePath;
      const pathToDelete = `${folderName}/${fileNameWithoutExtension}`;
      urlsWithoutExtension.push(pathToDelete);
    });
    const response = await cloudinary.api.delete_resources(
      urlsWithoutExtension
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const deleteThumbnailFromCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    let splittedUrl = localFilePath.split("/");
    let folderName = splittedUrl[splittedUrl.length - 2];
    const filePath = splittedUrl[splittedUrl.length - 1];

    const lastDotIndex = filePath.lastIndexOf(".");
    const fileNameWithoutExtension =
      lastDotIndex !== -1 ? filePath.substring(0, lastDotIndex) : filePath;
    const response = await cloudinary.uploader.destroy(
      `${folderName}/${fileNameWithoutExtension}`
    );

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  deleteImagesFromCloudinary,
  deleteThumbnailFromCloudinary,
  uploadOnCloudinary,
};
