import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentOrders } from "../features/Order/orderSlice";
import { fetchCurrentOrdersAsync } from "../features/Order/orderSlice";
import { getLoggedInUser } from "../features/auth/AuthSlice";

const OrderSuccess = () => {
  const user = useSelector(getLoggedInUser);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentOrdersAsync(user.data.id));
  }, [dispatch, user]);
  const CurrentOrders = useSelector(getCurrentOrders);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      {CurrentOrders.length === 0 && (
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                404
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                You haven't order till now 🥺
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                No problem, Shop Now 👇
              </p>
              <Link
                to="/"
                className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
              >
                Shop Shop Shop
              </Link>
            </div>
          </div>
        </section>
      )}
      {CurrentOrders.length > 0 && (
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
            Thanks for your order!
          </h2>
          {CurrentOrders?.map((elem) => (
            <div key={elem.id}>
              <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                Your order ID{" "}
                <span className="font-medium text-gray-900 dark:text-white hover:underline">
                  # {elem.id}
                </span>{" "}
                will be processed within 24 hours during working days. We will
                notify you by email once your order has been shipped.
              </p>
              <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                <dl className="sm:flex items-center justify-between gap-4">
                  <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                    Date
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                    {new Date(elem?.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(elem?.orderDate).toLocaleTimeString("en-IN", {
                      hourCycle: "h24",
                    })}
                  </dd>
                </dl>
                <dl className="sm:flex items-center justify-between gap-4">
                  <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                    Payment Method
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                    {elem.selectedPaymentMethod}
                  </dd>
                </dl>
                <dl className="sm:flex items-center justify-between gap-4">
                  <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                    {elem.user.name}
                  </dd>
                </dl>
                <dl className="sm:flex items-center justify-between gap-4">
                  <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                    Address
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                    {elem.selectedAddress.address}
                  </dd>
                </dl>
                <dl className="sm:flex items-center justify-between gap-4">
                  <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                    Phone
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                    {elem.selectedAddress.phone}
                  </dd>
                </dl>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Link className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  Track your order
                </Link>
                <Link
                  to="/"
                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Return to shopping
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderSuccess;
