import { useEffect, useId, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearSingleProduct,
  fetchSingleProductAsync,
  getSingleProduct,
} from "../../product-list/ProductSlice";
import { Navigate, useParams } from "react-router-dom";
import NoImageFound from "../../../assets/No_Image_Found.jpg";
import ReviewsPage from "../../../pages/ReviewsPage";

import { getLoggedInUser } from "../../auth/AuthSlice";
const product = {
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: false },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "2XL", inStock: true },
    { name: "3XL", inStock: true },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Star = ({ variant }) => {
  const id = useId();

  let c1, c2;
  if (variant === "filled") {
    c1 = "#FBBC05";
    c2 = "#FBBC05";
  } else if (variant === "empty") {
    c1 = "#C4C4C4";
    c2 = "#C4C4C4";
  } else if (variant === "half") {
    c1 = "#FBBC05";
    c2 = "#C4C4C4";
  }

  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M10 0.148438L12.935 6.14144L19.5 7.10844L14.75 11.7704L15.871 18.3564L10 15.2454L4.129 18.3564L5.25 11.7704L0.5 7.10844L7.064 6.14144L10 0.148438Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
};

const Rating = ({ rating, max = 5 }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: Math.floor(rating) }, (_, i) => (
        <Star key={i} variant="filled" />
      ))}
      {!Number.isInteger(rating) && <Star variant="half" />}
      {Array.from({ length: max - Math.ceil(rating) }, (_, i) => (
        <Star key={i} variant="empty" />
      ))}
    </div>
  );
};

const SingleProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const loggedInUser = useSelector(getLoggedInUser);
  const isUserNotLoggedIn = loggedInUser?.length === 0;

  let selectedProduct = useSelector(getSingleProduct);
  useEffect(() => {
    if (selectedProduct && Object.keys(selectedProduct)?.length === 0 && id) {
      dispatch(fetchSingleProductAsync(id));
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  let firstBreadCrumb_Category = selectedProduct?.category;
  let secondBreadCrumb_Brand = selectedProduct?.brand;
  const breadcrumbs = [
    {
      id: 1,
      name:
        firstBreadCrumb_Category?.charAt(0).toUpperCase() +
          firstBreadCrumb_Category?.slice(1).split("-").join(" ") || "Men's",
    },
    { id: 2, name: secondBreadCrumb_Brand },
  ];

  const isImageLoadedCheck = Array.isArray(selectedProduct.images);

  const highlights = [
    {
      name:
        `Minimum Order Quantity : ${
          selectedProduct.minimumOrderQuantity > selectedProduct.stock
            ? selectedProduct.stock
            : selectedProduct.minimumOrderQuantity
        }` || 3,
    },
    {
      name:
        `Return Policy : ${selectedProduct.returnPolicy}` ||
        "7 days return policy",
    },
    {
      name:
        `Shipping Information : ${selectedProduct.shippingInformation}` ||
        "Ships in 1 week",
    },
    {
      name:
        `Availability Status : ${selectedProduct.availabilityStatus}` ||
        "In Stock",
    },
    {
      name: `Stock Available : ${selectedProduct.stock}`,
    },
  ];
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  useEffect(() => {
    return () => {
      dispatch(clearSingleProduct());
    };
  }, []);

  if (Object.keys(selectedProduct).length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-950 rounded-lg">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <div className="mr-2 text-sm font-medium text-white">
                    {breadcrumb.name}
                  </div>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <div
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {selectedProduct?.title || ""}
              </div>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={
                (isImageLoadedCheck && selectedProduct.images[3]) ||
                (isImageLoadedCheck && selectedProduct.images[0]) ||
                NoImageFound
              }
              alt={selectedProduct.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={
                  (isImageLoadedCheck && selectedProduct.images[1]) ||
                  NoImageFound
                }
                alt={selectedProduct.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={
                  (isImageLoadedCheck && selectedProduct.images[2]) ||
                  NoImageFound
                }
                alt={selectedProduct.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={selectedProduct.thumbnail}
              alt={selectedProduct.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {selectedProduct?.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-white">
              $ {parseFloat(selectedProduct?.price)?.toFixed(2)}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Rating rating={selectedProduct?.rating} />
                </div>
                <p className="sr-only">
                  {selectedProduct.rating} out of 5 stars
                </p>
                <div className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {selectedProduct?.reviews?.length || 64} reviews
                </div>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-white">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center space-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        aria-label={color.name}
                        className={({ focus, checked }) =>
                          classNames(
                            color.selectedClass,
                            focus && checked ? "ring ring-offset-1" : "",
                            !focus && checked ? "ring-2" : "",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                          )
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.class,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Size</h3>
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Size guide
                  </div>
                </div>

                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                  >
                    {product.sizes.map((size) => (
                      <Radio
                        key={size.name}
                        value={size}
                        disabled={!size.inStock}
                        className={({ focus }) =>
                          classNames(
                            size.inStock
                              ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                              : "cursor-not-allowed bg-gray-50 text-gray-200",
                            focus ? "ring-2 ring-indigo-500" : "",
                            "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                          )
                        }
                      >
                        {({ checked, focus }) => (
                          <>
                            <span>{size.name}</span>
                            {size.inStock ? (
                              <span
                                className={classNames(
                                  checked
                                    ? "border-indigo-500"
                                    : "border-transparent",
                                  focus ? "border" : "border-2",
                                  "pointer-events-none absolute -inset-px rounded-md"
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line
                                    x1={0}
                                    y1={100}
                                    x2={100}
                                    y2={0}
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-slate-300">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-white">Highlights</h3>

              <div className="mt-4">
                <ul className="list-disc space-y-2 pl-4 text-sm">
                  {highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-400">
                      <span className="text-slate-300">{highlight.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Review */}
        <ReviewsPage
          selectedProduct={selectedProduct}
          isUserNotLoggedIn={isUserNotLoggedIn}
        />
      </div>
    </div>
  );
};

export default SingleProduct;
