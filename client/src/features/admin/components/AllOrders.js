import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  getAllOrders,
  getTotalOrders,
  updateOrderStatusAsync,
} from "../../Order/orderSlice";
import { ITEMS_PER_PAGE_ALL_ORDERS } from "../../../app/constants";
import { showToast } from "../../../utils/showToast";
import Pagination from "../../Pagination/Pagination";

const AllOrders = () => {
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState("DEFAULT");
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrders);
  const totalOrders = useSelector(getTotalOrders);
  const handlePagination = (page) => {
    setPage(page);
  };
  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE_ALL_ORDERS };
    dispatch(fetchAllOrdersAsync(pagination));
  }, [dispatch, page]);
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
  const handleOrderStatusChange = (item) => {
    if (selectedStatus !== "DEFAULT") {
      if (item.status !== selectedStatus) {
        const updatedOrder = { ...item, status: selectedStatus };
        dispatch(updateOrderStatusAsync(updatedOrder));
      } else {
        showToast("ERROR", "Same Option Selected");
      }
    }
    setSelectedOrderId(-1);
    setSelectedStatus("DEFAULT");
  };
  return (
    <>
      {/* component */}
      <section className="container px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-x-3">
                          <button className="flex items-center gap-x-2">
                            <span>Order ID</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Items
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {orders?.map((item) => (
                      <tr>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <span>#{item.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {new Date(item?.orderDate)?.toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </td>
                        {selectedOrderId === item.id ? (
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            <select
                              className="rounded-lg w-full block p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              defaultValue={"DEFAULT"}
                              onChange={(e) => {
                                setSelectedStatus(e.target.value);
                              }}
                            >
                              <option hidden value={"DEFAULT"}>
                                Select Status
                              </option>
                              {status.map((statusObj) => {
                                return Object.keys(statusObj).map((item) => (
                                  <option value={statusObj[item].title}>
                                    {statusObj[item].label}
                                  </option>
                                ));
                              })}
                            </select>
                          </td>
                        ) : (
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
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
                                  {currStatus.label}
                                </dd>
                              );
                            })}
                          </td>
                        )}
                        <td className="px-2 py-4 text-sm  text-gray-500 dark:text-gray-300 text-left w-full sm:w-auto">
                          {item.cartItems?.map((cartItem) => (
                            <div className="flex items-center gap-x-2 pb-3">
                              <img
                                className="object-cover w-8 h-8 rounded-full"
                                src={
                                  cartItem.item.images[0] ||
                                  cartItem.item.thumbnail
                                }
                                alt=""
                              />
                              <div>
                                <p className="text-sm text-gray-800 dark:text-white ">
                                  {cartItem.item.title?.length > 15
                                    ? cartItem.item.title?.slice(0, 15) + "..."
                                    : cartItem.item.title}
                                </p>
                                <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                  x-{cartItem.quantity} -{" $"}
                                  {item.pricing.final_amount}
                                </p>
                              </div>
                            </div>
                          ))}
                        </td>

                        <td className="px-4 py-4 text-sm ">
                          <div className="text-white flex-col text-xs">
                            <div className="flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                              </svg>

                              {item.selectedAddress.fullName}
                            </div>
                            <div className="flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                />
                              </svg>

                              {item.selectedAddress.email}
                            </div>
                            <div className="flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                                />
                              </svg>

                              {item.selectedAddress.phone}
                            </div>
                            <div className="flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                              </svg>

                              <span className="text-wrap text-gray-300 max-w-48">
                                {item.selectedAddress.address}
                              </span>
                            </div>
                            <div className="text-wrap text-gray-300 max-w-48 flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                              </svg>

                              {item.selectedAddress.pinCode}
                            </div>
                            <div className="text-wrap text-gray-300 max-w-48 flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-4 mb-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                                />
                              </svg>
                              userId:- #{item.user.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {selectedOrderId === item.id ? (
                            <div onClick={() => handleOrderStatusChange(item)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6 text-white cursor-pointer"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 12.75 6 6 9-13.5"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div onClick={() => setSelectedOrderId(item.id)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6 text-white cursor-pointer"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  handlePagination={handlePagination}
                  page={page}
                  setPage={setPage}
                  isAdmin={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllOrders;
