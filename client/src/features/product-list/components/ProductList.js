import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../../../pages/Loading";
import {
  fetchSingleProductAsync,
  selectAllProducts,
  checkIsLoading as productLoader,
} from "../ProductSlice";
import { StarIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../../auth/AuthSlice";
import { showToast } from "../../../utils/showToast";
import {
  addToCartAsync,
  getLoggedInUserCartItems,
  removeFromCartAsync,
} from "../../cart/cartSlice";
export function ProductList() {
  const products = useSelector(selectAllProducts);
  const productLoading = useSelector(productLoader);
  const loggedInUser = useSelector(getLoggedInUser);
  const isUserNotLoggedIn = loggedInUser?.length === 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(getLoggedInUserCartItems);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleFetchSingleProduct = (id) => {
    dispatch(fetchSingleProductAsync(id))
      .unwrap()
      .then((res) => {
        if (Object.keys(res).length > 0) {
          navigate(`/selected-product/${id}`);
        } else {
          console.log("err");
        }
      });
  };
  const handleCart = async (product) => {
    try {
      const res = await dispatch(
        addToCartAsync({
          items: { productId: product._id, quantity: 1 },
          userId: loggedInUser.user.id,
        })
      );
      if (res?.error) {
        let error = JSON.parse(res.error.message);
        showToast("ERROR", error.message);
      }
      if (res?.payload?.success) {
        showToast("SUCCESS", res.payload.message);
      }
    } catch (error) {
      showToast("ERROR", "Login Failed, Try again");
    }
  };
  const handleRemoveFromCart = async (productId) => {
    const response = await dispatch(
      removeFromCartAsync({ productId, userId: loggedInUser.user.id })
    );
    if (response?.error) {
      let error = JSON.parse(response.error.message);
      showToast("ERROR", error.message);
    }
    if (response?.payload?.success) {
      showToast("SUCCESS", response.payload.message);
    }
  };

  return (
    <div>
      {productLoading && <LoadingPage loadingMessage="Fetching product..." />}
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 ">
          {products?.map((product) => {
            let P = product.price || 100;
            let d = 1 - product.discountPercentage / 100 || 25;
            const priceBeforeDiscount = (P / d).toFixed(2);

            return (
              <div key={product._id}>
                <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.thumbnail}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-slate-50">
                        <div className="cursor-pointer">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.title?.length > 22
                            ? `${product.title.slice(0, 22)}...`
                            : product.title}
                        </div>
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        <StarIcon className={classNames("h-5 w-5 inline")} />
                        <span className="align-bottom ml-1">
                          {product.rating}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        $ {product.price}
                      </p>
                      <p className="text-sm font-medium text-slate-400 line-through">
                        $ {priceBeforeDiscount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() => handleFetchSingleProduct(product._id)}
                  >
                    View
                  </button>
                  {cartItems?.some((elem) => product._id === elem.productId) &&
                  !isUserNotLoggedIn ? (
                    <button
                      type="button"
                      className={`inline-flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 hover:bg-red-700 bg-red-600`}
                      onClick={() => handleRemoveFromCart(product._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="-ms-2 me-1 h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`inline-flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
                        isUserNotLoggedIn
                          ? "bg-slate-800 cursor-not-allowed"
                          : "hover:bg-primary-800 bg-primary-700"
                      } `}
                      onClick={() => handleCart(product)}
                      disabled={isUserNotLoggedIn}
                    >
                      <svg
                        className="-ms-2 me-1 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
