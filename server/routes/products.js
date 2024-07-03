const express = require("express");
const router = express.Router();
module.exports = function (upload) {
  // POST /api/products - Create a new product
  router.post(
    "/add",
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    async (req, res) => {
      try {
        const { body, files } = req;
        res
          .status(200)
          .json({ ...body, ...files, thumbnail: files.thumbnail[0] });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  );

  // GET /api/products - Get all products
  //   router.get("/", async (req, res) => {
  //     try {
  //       const products = await Product.find();
  //       res.json(products);
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ message: "Server Error" });
  //     }
  //   });

  return router;
};
