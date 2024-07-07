import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../Navbar/AdminNavbar";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIsLoading,
  clearSingleProduct,
  fetchSingleProductAsync,
  getAllBrands,
  getAllCategories,
  getSingleProduct,
  removeProductAsync,
  updateProductAsync,
} from "../../product-list/ProductSlice";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { showToast } from "../../../utils/showToast";
import * as Yup from "yup";
import LoadingPage from "../../../pages/Loading";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import CustomDialog from "../../../utils/customDialog";
const EditProduct = () => {
  const brands = useSelector(getAllBrands);
  const categories = useSelector(getAllCategories);
  const [formValues, setFormValues] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchSingleProductAsync(id));
  }, []);
  const product = useSelector(getSingleProduct);
  const {
    title,
    brand,
    category,
    description,
    price,
    discountPercentage,
    minimumOrderQuantity,
    returnPolicy,
    shippingInformation,
    stock,
    availabilityStatus,
    rating,
  } = product;
  useEffect(() => {
    return () => {
      dispatch(clearSingleProduct());
    };
  }, []);
  const isLoading = useSelector(checkIsLoading);
  const [dispatchAction, setDispatchAction] = useState("");
  const [open, setOpen] = useState(false);
  const handleUpdateProduct = () => {
    dispatch(updateProductAsync(formValues));
    showToast("SUCCESS", "Product Updated");
    navigate("/admin/home");
  };
  const handleRemoveProduct = () => {
    dispatch(removeProductAsync(product?.id));
    showToast("SUCCESS", "Product Removed");
    navigate("/admin/home");
  };
  return (
    <>
      {isLoading && <LoadingPage loadingMessage="Fetching..." />}
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Product {`<->`} #{id}
          </h2>
          {product && !isLoading && (
            <Formik
              initialValues={{
                title,
                brand,
                price,
                category,
                discountPercentage,
                minimumOrderQuantity,
                returnPolicy,
                shippingInformation,
                stock,
                availabilityStatus,
                description,
                rating,
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Product requires a name."),
                brand: Yup.string().required("Product need a brand."),
                price: Yup.number()
                  .required("Product should have a price")
                  .min(1, "Negative price?"),
                rating: Yup.number()
                  .max(5, "Max 5 rating can be given")
                  .min(1, "Negative rating?"),
                category: Yup.string().required("Product needs a category."),
                discountPercentage: Yup.number()
                  .max(100, "Who gives more than 100% discount?")
                  .min(0, "Must be >= 0"),
                minimumOrderQuantity: Yup.number().min(0, "Must be >= 0"),
                returnPolicy: Yup.string().required("Please add return policy"),
                shippingInformation: Yup.string().required(
                  "Please add shipping info"
                ),
                stock: Yup.number()
                  .required("Product should have some stock")
                  .min(0, "Must be >= 0"),
                availabilityStatus: Yup.string().required("Required field"),
                description: Yup.string()
                  .required("Product should have a description")
                  .max(250, "250 words are enough to describe..."),
              })}
              onSubmit={(values, action) => {
                setFormValues({ ...values, id });
                setDispatchAction("update");
                setOpen(true);
                action.resetForm();
              }}
            >
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
                      Price
                    </label>
                    <Field
                      type="number"
                      name="rating"
                      id="rating"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="5"
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
                <div className="flex gap-12">
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200"
                  >
                    Update product
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-primary-200 "
                    onClick={() => {
                      setOpen(true);
                      setDispatchAction("remove");
                    }}
                  >
                    Remove product
                  </button>
                </div>
              </Form>
            </Formik>
          )}
        </div>
      </section>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          Icon={dispatchAction === "remove" ? TrashIcon : PencilIcon}
          buttonColor={dispatchAction === "remove" ? "red" : "green"}
          buttonText={dispatchAction === "remove" ? "Remove" : "Update"}
          dialogContent={
            dispatchAction === "remove"
              ? "Are you sure you want to remove selected product?"
              : "Are you sure you want to edit selected product?"
          }
          dialogTitle={
            dispatchAction === "remove" ? "Remove Product" : "Update Product"
          }
          onConfirm={
            dispatchAction === "remove"
              ? handleRemoveProduct
              : handleUpdateProduct
          }
        />
      )}
    </>
  );
};

export default EditProduct;
