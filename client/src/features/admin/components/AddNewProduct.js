import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewProductAsync,
  getAllBrands,
  getAllCategories,
} from "../../product-list/ProductSlice";
import * as Yup from "yup";
import axios from "axios";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/showToast";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CustomDialog from "../../../utils/customDialog";
const AddNewProduct = () => {
  const dispatch = useDispatch();
  const brands = useSelector(getAllBrands);
  const categories = useSelector(getAllCategories);
  const FILE_SIZE = 1000 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const thumbnailRef = useRef(null);
  const imagesRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const handleAddNewProduct = async () => {
    try {
      const res = await dispatch(createNewProductAsync(formValues));
      if (res?.error) {
        const errorMessages = JSON.parse(res.error.message);
        Object.values(errorMessages).forEach((val) => showToast("ERROR", val));
      }
      if (res?.payload?.success) {
        showToast("SUCCESS", res.payload.message);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        if (thumbnailRef.current) thumbnailRef.current.value = "";
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new product
        </h2>
        <Formik
          initialValues={{
            title: "",
            brand: "",
            price: "",
            category: "",
            discountPercentage: "",
            minimumOrderQuantity: "",
            returnPolicy: "",
            shippingInformation: "",
            warrantyInformation: "",
            stock: "",
            availabilityStatus: "",
            thumbnail: null,
            images: null,
            description: "",
            rating: 0,
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Product requires a name."),
            brand: Yup.string().required("Product need a brand."),
            price: Yup.number()
              .required("Product should have a price")
              .min(1, "Negative price?"),
            rating: Yup.number()
              .max(5, "Max 5 rating can be given")
              .min(0, "Negative rating?"),
            category: Yup.string().required("Product needs a category."),
            discountPercentage: Yup.number()
              .max(100, "Who gives more than 100% discount?")
              .min(0, "Must be >= 0"),
            minimumOrderQuantity: Yup.number()
              .required("Please Add Minimum Quantity")
              .min(0, "Must be >= 0"),
            returnPolicy: Yup.string().required("Please add return policy"),
            shippingInformation: Yup.string().required(
              "Please add shipping info"
            ),
            warrantyInformation: Yup.string().required(
              "Please add warranty info"
            ),
            stock: Yup.number()
              .required("Product should have some stock")
              .min(0, "Must be >= 0"),
            availabilityStatus: Yup.string().required("Required field"),
            thumbnail: Yup.mixed()
              .required("Thumbnail needed")
              .test(
                "fileSize",
                "File too large (Max 1MB)",
                (value) => value && !(value.size >= FILE_SIZE)
              )
              .test(
                "fileFormat",
                "Unsupported Format",
                (value) => value && SUPPORTED_FORMATS.includes(value.type)
              ),
            description: Yup.string()
              .required("Product should have a description")
              .max(250, "250 words are enough to describe..."),
            images: Yup.mixed()
              .required("Add at least 1 image to proceed")
              .test("fileLength", "Max 3 files can be selected", (value) => {
                if (!value) return false;
                if (value.length > 3) return false;
                return true;
              })
              .test("fileSize", "File too large (Max 1MB)", (value) => {
                if (!value) return false;
                for (let i = 0; i < value.length; i++) {
                  if (value[i].size >= FILE_SIZE) {
                    return false;
                  }
                }
                return true;
              })
              .test("fileFormat", "Unsupported Format", (value) => {
                if (!value) return false;
                for (let i = 0; i < value.length; i++) {
                  if (!SUPPORTED_FORMATS.includes(value[i].type)) {
                    return false;
                  }
                }
                return true;
              }),
          })}
          onSubmit={async (values, actions) => {
            const formData = new FormData();
            for (const key in values) {
              if (key === "images") {
                Array.from(values.images).forEach((file) => {
                  formData.append("images", file);
                });
              } else {
                formData.append(key, values[key]);
              }
            }
            setFormValues(formData);
            setOpen(true);
            actions.resetForm();
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Name
                  </label>
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="title" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Brands
                  </label>
                  <Field
                    as="select"
                    id="brand"
                    name="brand"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Brand
                    </option>
                    {brands?.map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="brand" />
                  </p>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="rating"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Rating
                  </label>
                  <Field
                    type="number"
                    name="rating"
                    id="rating"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="$2999"
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="rating" />
                  </p>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <Field
                    type="number"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="$2999"
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="price" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Category
                    </option>
                    {categories?.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="category" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount %
                  </label>
                  <Field
                    type="number"
                    name="discountPercentage"
                    id="discountPercentage"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={12}
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="discountPercentage" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="minimumOrderQuantity"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Minimum Order Quantity
                  </label>
                  <Field
                    type="number"
                    name="minimumOrderQuantity"
                    id="minimumOrderQuantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={12}
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="minimumOrderQuantity" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="returnPolicy"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Return Policy
                  </label>
                  <Field
                    as="select"
                    name="returnPolicy"
                    id="returnPolicy"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Return Policy
                    </option>
                    <option value="No return policy">No return policy</option>
                    <option value="7 days return policy">
                      7 days return policy
                    </option>
                    <option value="30 days return policy">
                      30 days return policy
                    </option>
                    <option value="60 days return policy">
                      60 days return policy
                    </option>
                    <option value="90 days return policy">
                      90 days return policy
                    </option>
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="returnPolicy" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="shippingInformation"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Warranty Information
                  </label>
                  <Field
                    as="select"
                    id="warrantyInformation"
                    name="warrantyInformation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Warrant Information
                    </option>
                    <option value="No warranty">No warranty</option>
                    <option value="1 week warranty">1 week warranty</option>
                    <option value="1 month warranty">1 month warranty</option>
                    <option value="3 months warranty">3 months warranty</option>
                    <option value="6 months warranty">6 months warranty</option>
                    <option value="1 year warranty">1 year warranty</option>
                    <option value="2 years warranty">2 years warranty</option>
                    <option value="3 years warranty">3 years warranty</option>
                    <option value="5 years warranty">5 years warranty</option>
                    <option value="Lifetime warranty">Lifetime warranty</option>
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="warrantyInformation" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="shippingInformation"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shipping Information
                  </label>
                  <Field
                    as="select"
                    id="shippingInformation"
                    name="shippingInformation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Shipping Information
                    </option>
                    <option value="Ships Overnight">Ships Overnight</option>
                    <option value="Ships in 1 week">Ships in 1 week</option>
                    <option value="Ships in 2 weeks">Ships in 2 weeks</option>
                    <option value="Ships in 1 month">Ships in 1 month</option>
                    <option value="Ships in 1-2 business days">
                      Ships in 1-2 business days
                    </option>
                    <option value="Ships in 3-5 business days">
                      Ships in 3-5 business days
                    </option>
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="shippingInformation" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="stockAvailable"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Stock Count
                  </label>
                  <Field
                    type="number"
                    name="stock"
                    id="stockAvailable"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={12}
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="stock" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="availabilityStatus"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Availability Status
                  </label>
                  <Field
                    as="select"
                    id="availabilityStatus"
                    name="availabilityStatus"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    // defaultValue={"DEFAULT"}
                  >
                    <option value="DEFAULT" hidden>
                      Select Availability Status
                    </option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out Of Stock">Out Of Stock</option>
                  </Field>
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="availabilityStatus" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="thumbnail"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Add Thumbnail
                  </label>
                  <Field
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    accept="image/png,image/jpg,image/jpeg"
                    value={undefined}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    innerRef={thumbnailRef}
                    onChange={(event) => {
                      setFieldValue("thumbnail", event.currentTarget.files[0]);
                    }}
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="thumbnail" />
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="images"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Add Images
                  </label>
                  <Field
                    name="images"
                    accept="image/png,image/jpg,image/jpeg"
                    multiple
                    id="images"
                    type="file"
                    innerRef={imagesRef}
                    onChange={(event) => {
                      setFieldValue("images", event.currentTarget.files);
                    }}
                    value={undefined}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="images" />
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    rows={8}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Your description here"
                    name="description"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="description" />
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Add product
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          Icon={PlusCircleIcon}
          buttonColor="green"
          buttonText="Add"
          dialogContent="Confirm want to add new product?"
          dialogTitle="Add New Product"
          onConfirm={handleAddNewProduct}
        />
      )}
    </section>
  );
};

export default AddNewProduct;
