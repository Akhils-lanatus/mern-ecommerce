import { ProductModel } from "../models/product.model.js";
import { errorHandler } from "../utils/errorHandler.js";

//ADMIN
export const adminAddNewProduct = async (req, res, next) => {
  try {
    const { body, files } = req;
    const imagesUrls = files.images.map(
      (file) => `http://localhost:8080/${file.path}`
    );
    const thumbnailUrl = `http://localhost:8080/${files?.thumbnail[0].path}`;
    const allData = { ...body, images: imagesUrls, thumbnail: thumbnailUrl };
    const { title } = body;
    Object.keys(body).forEach((key) => console.log(body[key]));
    const isTitleUsed = await ProductModel.findOne({ title });
    if (isTitleUsed) {
      return res.status(400).json({
        success: false,
        message: "Product Title Already Used",
      });
    }
    // res.status(200).json({ ...body, ...files, thumbnail: files.thumbnail[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};
