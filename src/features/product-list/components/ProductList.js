import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProductsAsync, selectAllProducts } from "../ProductSlice";
import { StarIcon } from "@heroicons/react/20/solid";

export function ProductList() {
  const products = useSelector(selectAllProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProductsAsync());
  }, []);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  // console.log(products[0]);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 ">
          {products.map((product) => {
            let P = product.price || 100;
            let d = 1 - product.discountPercentage / 100 || 25;
            const priceBeforeDiscount = (P / d).toFixed(2);

            return (
              <div key={product.id} className="group relative">
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
                        <span aria-hidden="true" className="absolute inset-0" />
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="-ms-2 me-2 h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                      />
                    </svg>
                    View
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="-ms-2 me-2 h-5 w-5"
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
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
