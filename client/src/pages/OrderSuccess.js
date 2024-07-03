import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCurrentOrder,
  getCurrentOrders,
} from "../features/Order/orderSlice";
import { getLoggedInUser } from "../features/auth/AuthSlice";
import { emptyCartOnSuccessOrderAsync } from "../features/cart/cartSlice";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
const OrderSuccess = ({ open = false, setOpen = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getLoggedInUser);
  const CurrentOrders = useSelector(getCurrentOrders);
  useEffect(() => {
    return () => {
      dispatch(emptyCartOnSuccessOrderAsync(user.data.id));
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, user]);
  return (
    <section className=" py-8 antialiased bg-gray-900 md:py-16">
      {
        <Dialog
          className="relative z-10 "
          open={open}
          onClose={() => {
            setOpen(false);
            navigate("/");
          }}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                <div className="bg-gray-800 px-4 pb-2 pt-5 sm:p-4 sm:pb-2">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h1"
                        className="text-2xl font-semibold leading-6 text-white"
                      >
                        Thanks for your order!
                      </DialogTitle>

                      <div key={CurrentOrders.id}>
                        <p className=" dark:text-slate-300 font-medium mt-4 md:mt-4 mb-4 md:mb-4">
                          Your order ID{" "}
                          <span className="font-medium text-white dark:text-white hover:underline">
                            # {CurrentOrders.id}
                          </span>{" "}
                          You can check your orders in My Account {">"} My
                          Orders
                        </p>

                        <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100  p-6  mb-6 md:mb-8">
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Date
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {new Date(
                                CurrentOrders?.orderDate
                              )?.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              at{" "}
                              {new Date(
                                CurrentOrders?.orderDate
                              )?.toLocaleTimeString("en-IN", {
                                hourCycle: "h24",
                              })}
                            </dd>
                          </dl>
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Payment Method
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {CurrentOrders.selectedPaymentMethod}
                            </dd>
                          </dl>
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Delivery Method
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {CurrentOrders.selectedDeliveryMethod}
                            </dd>
                          </dl>
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Name
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {CurrentOrders?.user?.name}
                            </dd>
                          </dl>
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Address
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {CurrentOrders?.selectedAddress?.address}
                            </dd>
                          </dl>
                          <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-bold mb-1 sm:mb-0 text-white ">
                              Phone
                            </dt>
                            <dd className="font-medium text-yellow-200 sm:text-end">
                              {CurrentOrders?.selectedAddress?.phone}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-500 px-4 py-2 sm:flex sm:flex-row-reverse sm:px-4">
                  <div className="flex items-center space-x-4 my-2">
                    <button
                      className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                      onClick={() => {
                        setOpen(false);
                        navigate("/");
                      }}
                    >
                      Track your order
                    </button>
                    <Link
                      to="/"
                      className="py-2.5 px-5 text-sm font-medium  focus:outline-none rounded-lg border focus:z-10 focus:ring-4  dark:focus:ring-gray-700 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Return to shopping
                    </Link>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      }
    </section>
  );
};

export default OrderSuccess;
