import { validationResult } from "express-validator";
import { errorHandler } from "../utils/errorHandler.js";
import { ProductModel } from "../models/product.model.js";
import {
  deleteImagesFromCloudinary,
  deleteThumbnailFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

//ADMIN
export const adminAddNewProductController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const allErrors = {};
    const uniqueTitleError = {};
    if (!errors.isEmpty()) {
      errors.array().forEach((val) => {
        if (val.msg === "Title already used") {
          uniqueTitleError[val.path] = val.msg;
        } else {
          allErrors[val.path] = val.msg;
        }
      });
    }

    let sortedErrors = Object.values(allErrors);
    sortedErrors.sort((a, b) => a.length - b.length);

    if (Object.keys(allErrors).length || Object.keys(uniqueTitleError).length) {
      return res.status(400).json({
        success: false,
        error: Object.keys(uniqueTitleError).length
          ? uniqueTitleError
          : sortedErrors,
      });
    }

    const { body, files } = req;
    const imagesUrls = files.images.map((file) => `${file.path}`);
    const cloudinaryImagesUrls = [];
    const thumbnailUrl = `${files?.thumbnail[0].path}`;
    for (const image in imagesUrls) {
      const result = await uploadOnCloudinary(imagesUrls[image]);
      cloudinaryImagesUrls.push(result.url);
    }
    if (cloudinaryImagesUrls.length !== imagesUrls.length) {
      return res.status(400).json({
        success: false,
        message: "Error while adding images",
      });
    }
    const thumbnailUrlPath = await uploadOnCloudinary(thumbnailUrl);
    if (!thumbnailUrlPath) {
      return res.status(400).json({
        success: false,
        message: "Error while adding thumbnail",
      });
    }
    const allData = {
      ...body,
      images: cloudinaryImagesUrls,
      thumbnail: thumbnailUrlPath.url,
    };
    const product = await ProductModel.create(allData);
    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const fetchAllProductsController = async (req, res) => {
  let {
    category = "",
    brand = [],
    _sort = "_id",
    _order = "asc",
    _page = 1,
    _limit = 10,
  } = req.query;

  try {
    let matchStage = {};

    _page = parseInt(_page);
    _limit = parseInt(_limit);

    if (category) {
      matchStage.category = category;
    }
    if (brand?.length) {
      matchStage.brand = { $in: brand };
    }
    const result = await ProductModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: { [_sort]: _order === "asc" ? 1 : -1 },
      },
      {
        $facet: {
          totalCount: [{ $count: "totalProducts" }],
          products: [{ $skip: (_page - 1) * _limit }, { $limit: _limit }],
        },
      },
    ]);

    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].totalProducts
      : 0;
    const products = result[0].products;

    return res.status(200).json({
      totalCount,
      currentPage: _page,
      totalPages: Math.ceil(totalCount / _limit),
      products,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const fetchSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      product,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removeProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ProductModel.findByIdAndDelete(id);
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }
    const thumbnailResponse = await deleteThumbnailFromCloudinary(
      response.thumbnail
    );
    const imagesResponse = await deleteImagesFromCloudinary(response.images);
    if (thumbnailResponse?.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "Failed to delete thumbnail",
      });
    }
    if (
      !imagesResponse ||
      !imagesResponse.deleted ||
      imagesResponse.deleted === null ||
      imagesResponse.deleted === undefined ||
      !Object.keys(imagesResponse.deleted).length
    ) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete delete some or all images",
      });
    }
    const remainingCount = await ProductModel.countDocuments();
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      remainingCount,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await ProductModel.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
