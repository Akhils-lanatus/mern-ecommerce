import React, { useEffect } from "react";
import Navbar from "../../../features/Navbar/Navbar";
import LoadingPage from "../../../pages/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  getLoggedInUserAllOrders,
  checkIsLoading,
} from "../userSlice";
import { getLoggedInUser } from "../../auth/AuthSlice";
import NoDetailsFound from "../../../pages/NoDetailsFound";
const UserOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  const isLoading = useSelector(checkIsLoading);
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
      {isLoading && <LoadingPage loadingMessage="Fetching Your Orders..." />}
      <section className="bg-white py-4 antialiased dark:bg-gray-900 md:py-4">
        {allOrders?.length === 0 && (
          <NoDetailsFound
            subText={"Place your first order and get................Nothing 😁"}
            centerText={"No orders found 😒"}
            buttonText={"Let's Shop"}
          />
        )}
        {allOrders?.length > 0 &&
          allOrders.map((orderItem) => {
            const shippingDetails = orderItem.selectedAddress;
            const pricingDetails = orderItem.pricing;
            return (
              <div
                key={orderItem.id}
                className="mx-auto max-w-screen-xl px-4 2xl:px-0"
              >
                <div className="mx-auto max-w-3xl">
                  <div className="inline-flex items-end gap-8 w-full">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-3 xl mt-4">
                      Order ID #{orderItem.id}
                    </h2>
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      {status.map((statusObj) => {
                        const currStatus = statusObj[orderItem.status];
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
                  </div>
                  <div className="mt-2 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Billing information
                    </h4>
                    {/* <dl className="w-full">
                      <div className="flex flex-col justify-between w-full lg:flex-row md:flex-row sm:flex-col">
                        <dt className="text-base font-medium text-gray-900 dark:text-white">
                          Name : {shippingDetails.fullName}
                        </dt>
                        <dt className="text-base font-medium text-gray-900 dark:text-white">
                          {shippingDetails.email}
                        </dt>
                        <dt className="text-base font-medium text-gray-900 dark:text-white">
                          {shippingDetails.phone}
                        </dt>
                      </div>

                      <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                        {shippingDetails.address}
                      </dd>
                    </dl> */}
                    <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100  p-6  mb-6 md:mb-8">
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Date
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {new Date(orderItem?.orderDate)?.toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(orderItem?.orderDate)?.toLocaleTimeString(
                            "en-IN",
                            {
                              hourCycle: "h24",
                            }
                          )}
                        </dd>
                      </dl>
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Payment Method
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {orderItem.selectedPaymentMethod}
                        </dd>
                      </dl>
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Delivery Method
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {orderItem.selectedDeliveryMethod}
                        </dd>
                      </dl>
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Name
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {shippingDetails?.fullName}
                        </dd>
                      </dl>
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Address
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {shippingDetails?.address}
                        </dd>
                      </dl>
                      <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-bold mb-1 sm:mb-0 text-white ">
                          Phone
                        </dt>
                        <dd className="font-medium text-yellow-200 sm:text-end">
                          {shippingDetails?.phone}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-3">
                    <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                      <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          {orderItem.cartItems.map((cartItem) => {
                            const item = cartItem.item;
                            return (
                              <tr key={cartItem.id}>
                                <td className="whitespace-nowrap py-4 md:w-[384px]">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center aspect-square w-10 h-10 shrink-0">
                                      <img
                                        className="h-auto w-full max-h-full block"
                                        src={item.images[0] || item.thumbnail}
                                        alt="im ac 2"
                                      />
                                    </div>
                                    <div className="hover:underline">
                                      {item.title}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-base font-normal text-gray-900 dark:text-white">
                                  x{cartItem.quantity}
                                </td>
                                <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                                  $
                                  {(item.price * cartItem?.quantity)?.toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 space-y-6">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Order summary
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Original price
                            </dt>
                            <dd className="text-base font-medium text-gray-900 dark:text-white">
                              $
                              {pricingDetails.totalAmountBeforeDiscount?.toFixed(
                                2
                              )}
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Savings
                            </dt>
                            <dd className="text-base font-medium text-green-500">
                              -${pricingDetails.savings}
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Store Pickup
                            </dt>
                            <dd className="text-base font-medium text-gray-900 dark:text-white">
                              ${pricingDetails.store_pickup_price}
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Tax
                            </dt>
                            <dd className="text-base font-medium text-gray-900 dark:text-white">
                              ${pricingDetails.tax_amount}
                            </dd>
                          </dl>
                        </div>
                        <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700 mb-2">
                          <dt className="text-lg font-bold text-gray-900 dark:text-white">
                            Total
                          </dt>
                          <dd className="text-lg font-bold text-gray-900 dark:text-white">
                            ${pricingDetails.final_amount}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </section>
    </Navbar>
  );
};

export default UserOrders;
