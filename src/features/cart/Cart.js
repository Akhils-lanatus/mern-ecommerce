import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addItemQuantityAsync,
  getLoggedInUserCartItems,
  removeFromCartAsync,
  removeItemQuantityAsync,
  checkIsLoading,
} from "../cart/cartSlice";
import LoadingPage from "../../pages/Loading";
import NoDetailsFound from "../../pages/NoDetailsFound";
const Cart = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(checkIsLoading);
  const cartItems = useSelector(getLoggedInUserCartItems || []);
  const totalAmount = cartItems?.reduce(
    (amount, item) => parseFloat(item.item.price * item.quantity + amount),
    0
  );
  const totalAmountBeforeDiscount = cartItems?.reduce((amount, item) => {
    let P = item.item.price || 100;
    let d = 1 - (item.item.discountPercentage / 100 || 0.25);
    const priceBeforeDiscount = (P / d).toFixed(2);

    return amount + parseFloat(priceBeforeDiscount * item.quantity);
  }, 0);

  const totalItems = cartItems?.reduce(
    (amount, item) => item.quantity + amount,
    0
  );

  const savings =
    parseFloat((totalAmountBeforeDiscount - totalAmount)?.toFixed(2)) || 0;
  const store_pickup_price = 10.0;
  const tax_amount = parseFloat((totalAmount * 0.02)?.toFixed(2));
  const final_amount = (
    totalAmountBeforeDiscount +
    store_pickup_price +
    tax_amount -
    savings
  )?.toFixed(2);
  const handleAddItemQuantity = (product) => {
    dispatch(addItemQuantityAsync(product));
  };
  const handleRemoveItemQuantity = (product) => {
    dispatch(removeItemQuantityAsync(product));
  };

  const handleRemoveFromCart = (product) => {
    const loggedInUserId = cartItems[0].user;
    const cartItem = cartItems.find(
      (elem) => elem.user === loggedInUserId && product.item.id === elem.item.id
    );
    if (cartItem) {
      const cartItemID = cartItem.id;
      dispatch(removeFromCartAsync(cartItemID));
    } else {
      console.log("NOT FOUND");
    }
  };

  return (
    <section className="py-4 antialiased md:py-4">
      {isLoading && <LoadingPage loadingMessage="Loading Cart..." />}
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {cartItems?.length === 0 && (
          <NoDetailsFound
            buttonText={"Let's Shop"}
            centerText={"Cart Is Empty 🫗"}
            subText={"Please add some products for further process..."}
          />
        )}

        {cartItems?.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Shopping Cart
            </h2>
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                <div className="space-y-6">
                  {cartItems.map((value) => {
                    const { item } = value;
                    return (
                      <div
                        key={value.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                      >
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <div className="shrink-0 md:order-1">
                            <img
                              className="h-20 w-20 block"
                              src={item.thumbnail}
                              alt={item.title}
                            />
                          </div>

                          <label htmlFor="counter-input" className="sr-only">
                            Choose quantity:
                          </label>
                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                id="decrement-button"
                                data-input-counter-decrement="counter-input"
                                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 ${
                                  value.quantity === 1
                                    ? "border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed"
                                    : "border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
                                }`}
                                disabled={
                                  value.quantity === 1 || value.stock === 0
                                }
                                onClick={() => handleRemoveItemQuantity(value)}
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 2"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h16"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                id="counter-input"
                                data-input-counter
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                placeholder=""
                                value={value.quantity}
                                readOnly
                              />
                              <button
                                type="button"
                                id="increment-button"
                                data-input-counter-increment="counter-input"
                                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 ${
                                  value.quantity >= item.stock
                                    ? "border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed"
                                    : "border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
                                }`}
                                onClick={() => handleAddItemQuantity(value)}
                                disabled={
                                  value.quantity >= item.stock ||
                                  value.stock === 0
                                }
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 1v16M1 9h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                $ {(item.price * value.quantity)?.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <div className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                              {item.title}
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                              >
                                <svg
                                  className="me-1.5 h-5 w-5"
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
                                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                  />
                                </svg>
                                Add to Favorites
                              </button>

                              <button
                                type="button"
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                onClick={() => handleRemoveFromCart(value)}
                              >
                                <svg
                                  className="me-1.5 h-5 w-5"
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
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="hidden xl:mt-8 xl:block">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    People also bought
                  </h3>
                  <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                    <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div href="#" className="overflow-hidden rounded">
                        <img
                          className="mx-auto h-44 w-44 dark:hidden"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                          alt="cart img"
                        />
                        <img
                          className="mx-auto hidden h-44 w-44 dark:block"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                          alt="cart img"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                          iMac 27”
                        </div>
                        <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                          This generation has some improvements, including a
                          longer continuous battery life.
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="line-through"> $399,99 </span>
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                          $299
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2.5">
                        <button
                          data-tooltip-target="favorites-tooltip-1"
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                            ></path>
                          </svg>
                        </button>
                        <div
                          id="favorites-tooltip-1"
                          role="tooltip"
                          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                        >
                          Add to favorites
                          <div
                            className="tooltip-arrow"
                            data-popper-arrow
                          ></div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                    <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div href="#" className="overflow-hidden rounded">
                        <img
                          className="mx-auto h-44 w-44 dark:hidden"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg"
                          alt="cart img"
                        />
                        <img
                          className="mx-auto hidden h-44 w-44 dark:block"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg"
                          alt="cart img"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                          Playstation 5
                        </div>
                        <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                          This generation has some improvements, including a
                          longer continuous battery life.
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="line-through"> $799,99 </span>
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                          $499
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2.5">
                        <button
                          data-tooltip-target="favorites-tooltip-2"
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                            ></path>
                          </svg>
                        </button>
                        <div
                          id="favorites-tooltip-2"
                          role="tooltip"
                          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                        >
                          Add to favorites
                          <div
                            className="tooltip-arrow"
                            data-popper-arrow
                          ></div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                    <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div href="#" className="overflow-hidden rounded">
                        <img
                          className="mx-auto h-44 w-44 dark:hidden"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg"
                          alt="cart img"
                        />
                        <img
                          className="mx-auto hidden h-44 w-44 dark:block"
                          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
                          alt="cart img"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                          Apple Watch Series 8
                        </div>
                        <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                          This generation has some improvements, including a
                          longer continuous battery life.
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="line-through"> $1799,99 </span>
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                          $1199
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2.5">
                        <button
                          data-tooltip-target="favorites-tooltip-3"
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                            ></path>
                          </svg>
                        </button>
                        <div
                          id="favorites-tooltip-3"
                          role="tooltip"
                          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                        >
                          Add to favorites
                          <div
                            className="tooltip-arrow"
                            data-popper-arrow
                          ></div>
                        </div>

                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order summary
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Total Items
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          {totalItems}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Original price
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          $ {totalAmountBeforeDiscount?.toFixed(2)}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Savings
                        </dt>
                        <dd className="text-base font-medium text-green-600">
                          -${savings}
                        </dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Store Pickup
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          ${store_pickup_price}
                        </dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Tax
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          $ {tax_amount}
                        </dd>
                      </dl>
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 dark:text-white">
                        Total
                      </dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white">
                        ${final_amount}
                      </dd>
                    </dl>
                  </div>

                  <Link
                    to="/checkout"
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    state={{
                      savings,
                      tax_amount,
                      store_pickup_price,
                      final_amount,
                      totalAmountBeforeDiscount,
                    }}
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {" "}
                      or{" "}
                    </span>
                    <Link
                      to="/"
                      title=""
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500 cursor-pointer"
                    >
                      Continue Shopping
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="voucher"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Do you have a voucher or gift card?{" "}
                      </label>
                      <input
                        type="text"
                        id="voucher"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder=""
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Apply Code
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
export default Cart;
