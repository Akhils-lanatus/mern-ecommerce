import React, { useEffect } from "react";
import Navbar from "../../../features/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  getLoggedInUserAllOrders,
} from "../userSlice";
import { getLoggedInUser } from "../../auth/AuthSlice";
const UserOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  const allOrders = useSelector(getLoggedInUserAllOrders);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync(user.data.id));
  }, [dispatch, user]);

  const status = [
    {
      pending: {
        className: "bg-yellow-900 text-yellow-300",
        pathD:
          "M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z",
        label: "Pending",
        title: "pending",
      },
      confirmed: {
        className: "bg-green-900 text-green-300",
        pathD: "M5 11.917 9.724 16.5 19 7.5",
        label: "Confirmed",
        title: "confirmed",
      },
      cancelled: {
        className: "bg-red-900 text-red-300",
        pathD: "M6 18 17.94 6M18 18 6.06 6",
        label: "Cancelled",
        title: "cancelled",
      },
      dispatched: {
        className: "bg-yellow-900 text-yellow-300",
        pathD:
          "M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
        label: "Dispatched",
        title: "dispatched",
      },
    },
  ];

  return (
    <Navbar>
      <section className="bg-white py-4 antialiased dark:bg-gray-900 md:py-4">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My orders
              </h2>
              <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                <div>
                  <label
                    htmlFor="order-type"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select order type
                  </label>
                  <select
                    id="order-type"
                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    defaultValue={"all"}
                  >
                    <option value="all">All orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <span className="inline-block text-gray-500 dark:text-gray-400">
                  {" "}
                  from{" "}
                </span>
                <div>
                  <label
                    htmlFor="duration"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select duration
                  </label>
                  <select
                    id="duration"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    defaultValue={"0"}
                  >
                    <option value="0">all</option>
                    <option value="7">this week</option>
                    <option value="30">this month</option>
                    <option value="90">the last 3 months</option>
                    <option value="120">the last 6 months</option>
                    <option value="365">this year</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flow-root sm:mt-8">
              {allOrders?.map((item) => (
                <div
                  key={item.id}
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <div className="flex flex-wrap items-end gap-y-4 py-6">
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Order ID:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        <div className="hover:underline">{item.id}</div>
                      </dd>
                    </dl>
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Date:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {new Date(item?.orderDate)?.toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        ,{" "}
                        {new Date(item?.orderDate)?.toLocaleTimeString(
                          "en-IN",
                          {
                            hourCycle: "h24",
                          }
                        )}
                      </dd>
                    </dl>
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base text-center font-medium text-gray-500 dark:text-gray-400">
                        Price:
                      </dt>
                      <dd className="mt-1.5 text-base text-center font-semibold text-gray-900 dark:text-white">
                        ${item.price}
                      </dd>
                    </dl>
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Status:
                      </dt>

                      {status.map((statusObj) => {
                        const currStatus = statusObj[item.status];
                        return (
                          <dd
                            key={currStatus}
                            className={`me-2 mt-1.5 inline-flex items-center rounded  px-2.5 py-0.5 text-xs font-medium ${currStatus.className}`}
                          >
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={currStatus.pathD}
                              />
                            </svg>
                            {currStatus.title}
                          </dd>
                        );
                      })}
                    </dl>
                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-start gap-4">
                      {(item.status === "pending" ||
                        item.status === "dispatched") && (
                        <button
                          type="button"
                          className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                        >
                          Cancel order
                        </button>
                      )}
                      <div className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">
                        View details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* PAGINATION */}
          </div>
        </div>
      </section>
    </Navbar>
  );
};

export default UserOrders;
