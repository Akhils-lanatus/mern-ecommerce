import { Country, State, City } from "country-state-city";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getLoggedInUserCartItems } from "../features/cart/cartSlice";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import {
  updateUserFromCheckoutAsync,
  getLoggedInUserInfo,
} from "../features/user/userSlice";
import { createOrderAsync } from "../features/Order/orderSlice";
import OrderSuccess from "./OrderSuccess";

const paymentMethods = [
  {
    name: "payment-method",
    value: "Credit Card",
    subText: "Pay with your credit card",
  },
  {
    name: "payment-method",
    value: "Payment on delivery",
    subText: "+$15 payment processing fee",
  },
  {
    name: "payment-method",
    value: "Paypal account",
    subText: "Connect to your account",
  },
];
const deliveryMethods = [
  {
    name: "delivery-method",
    label: "Free Delivery",
    value: "Free Delivery",
    subText: "Get it by Friday, 13 Dec 2023",
  },
  {
    name: "delivery-method",
    label: "Fast Delivery",
    value: "$15 - Fast Delivery",
    subText: "Get it by Tomorrow",
  },
  {
    name: "delivery-method",
    label: "Express Delivery",
    value: "$49 - Express Delivery",
    subText: "Get it today",
  },
];

const CheckoutPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector(getLoggedInUserCartItems);
  const loggedInUser = useSelector(getLoggedInUserInfo);
  const [selectedAddress, setSelectedAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    address: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [open, setOpen] = useState(false);

  const {
    savings,
    tax_amount,
    store_pickup_price,
    final_amount,
    totalAmountBeforeDiscount,
  } = location.state !== null && location.state;

  const allAddressOfUser = useMemo(() => {
    return loggedInUser?.data?.addresses || [];
  }, [loggedInUser]);

  const handleOrders = () => {
    try {
      const order = {
        user: loggedInUser.data,
        cartItems,
        selectedAddress,
        selectedDeliveryMethod,
        selectedPaymentMethod,
        orderDate: new Date(),
        status: "confirmed",
        pricing: {
          savings,
          tax_amount,
          store_pickup_price,
          final_amount,
          totalAmountBeforeDiscount,
        },
      };
      dispatch(createOrderAsync(order));
      setOpen(true);
    } catch (error) {
      setOpen(false);
      console.log(`Error while ordering :: ${error}`);
    }
  };

  if (cartItems?.length === 0) return <Navigate to={"/"} replace={true} />;
  return (
    <section
      className={`bg-white py-8 antialiased dark:bg-gray-900 md:py-8 ${
        open && "blur-md"
      } `}
    >
      <h1 className="text-4xl text-white mx-auto max-w-screen-xl px-4 2xl:px-0">
        Checkout
      </h1>
      {open && <OrderSuccess open={open} setOpen={setOpen} />}
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delivery Details
              </h2>

              <div>
                <Formik
                  initialValues={{
                    fullName: "",
                    email: "",
                    phone: "",
                    country: "",
                    state: "",
                    city: "",
                    pinCode: "",
                    address: "",
                  }}
                  validationSchema={Yup.object({
                    fullName: Yup.string()
                      .required("Name is required")
                      .max(40, "Max 40 characters allowed"),
                    email: Yup.string()
                      .required("Email is required")
                      .email("Invalid email format"),
                    phone: Yup.string()
                      .required("Phone Number is required")
                      .min(10, "Min 10 digits required")
                      .max(10, "Max 10 digits allowed"),
                    country: Yup.string().required("Country is required"),
                    state: Yup.string().required("State is required"),
                    city: Yup.string().required("City is required"),
                    pinCode: Yup.string()
                      .required("Pin Code is required")
                      .min(4, "Pin code must be at least of 4 digits")
                      .max(12, "Pin can't be greater than 12 digits"),
                    address: Yup.string()
                      .required("Address is required")
                      .max(100, "Max 100 characters are allowed"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    dispatch(
                      updateUserFromCheckoutAsync({
                        address: {
                          ...values,
                          country: Country.getCountryByCode(values.country)
                            .name,
                          state: State.getStateByCodeAndCountry(
                            values.state,
                            values.country
                          ).name,
                        },
                        user: loggedInUser.data,
                      })
                    );
                    resetForm();
                  }}
                >
                  {({ values }) => (
                    <Form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="your_name"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Your name{" "}
                        </label>
                        <Field
                          type="text"
                          id="your_name"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="Bonnie Green"
                          name="fullName"
                        />
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="fullName" />
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="your_email"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Your email*{" "}
                        </label>
                        <Field
                          type="email"
                          id="your_email"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="name@service.com"
                          name="email"
                        />
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="email" />
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="your_number"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Phone Number*{" "}
                        </label>
                        <Field
                          type="tel"
                          id="your_email"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="9876543210"
                          pattern="[0-9]{10}"
                          name="phone"
                        />
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="phone" />
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <label
                            htmlFor="select-country-input-3"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {" "}
                            Country*{" "}
                          </label>
                        </div>
                        <Field
                          as={"select"}
                          name="country"
                          id="select-country-input-3"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        >
                          <option disabled>Select Country</option>
                          {Country.getAllCountries().map((item) => (
                            <option key={item.isoCode} value={item.isoCode}>
                              {item.name}
                            </option>
                          ))}
                        </Field>
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="country" />
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <label
                            htmlFor="select-state-input-3"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {" "}
                            State*{" "}
                          </label>
                        </div>
                        <Field
                          as={"select"}
                          name="state"
                          id="select-state-input-3"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        >
                          {!values.country && (
                            <option value={0}>Select Country First</option>
                          )}

                          {State?.getStatesOfCountry(values.country).map(
                            (item) => (
                              <option key={item.name} value={item.isoCode}>
                                {item.name}
                              </option>
                            )
                          )}
                        </Field>
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="state" />
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <label
                            htmlFor="select-City-input-3"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {" "}
                            City*{" "}
                          </label>
                        </div>
                        <Field
                          as="select"
                          name="city"
                          id="select-City-input-3"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        >
                          {!values.state && (
                            <option value={0}>Select State First</option>
                          )}

                          {City?.getCitiesOfState(
                            values.country,
                            values.state
                          ).map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Field>
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="city" />
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="your_pinCode"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Pin Code{" "}
                        </label>
                        <Field
                          type="text"
                          id="your_pinCode"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="380050"
                          name="pinCode"
                        />
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="pinCode" />
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2 sm:grid-cols-1">
                          <label
                            htmlFor="select-City-input-3"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {" "}
                            Address*{" "}
                          </label>
                        </div>
                        <Field
                          as="textarea"
                          name="address"
                          id="your_address"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="Enter your address"
                          style={{ height: "calc(2.5rem + 2px)" }}
                        />
                        <p className="text-sm text-red-600 mt-2">
                          <ErrorMessage name="address" />
                        </p>
                      </div>

                      <div>
                        <button
                          type="reset"
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          Reset
                        </button>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
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
                              d="M5 12h14m-7 7V5"
                            />
                          </svg>
                          Add address
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {allAddressOfUser.length > 0 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Address
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {allAddressOfUser.map((elem, i) => (
                      <div key={i}>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex items-center">
                            <div className="flex h-5 items-center">
                              <input
                                id="credit-card"
                                aria-describedby="credit-card-text"
                                type="radio"
                                name={"user-address"}
                                value={JSON.stringify(elem)}
                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                onClick={(e) =>
                                  setSelectedAddress(JSON.parse(e.target.value))
                                }
                                required
                              />
                            </div>

                            <div className="ms-4 text-xs">
                              <label
                                htmlFor="credit-card"
                                className="font-medium leading-none text-gray-900 dark:text-white"
                              >
                                Email: {elem.email} <br /> Phone: {elem.phone}
                              </label>
                              <p
                                id="credit-card-text"
                                className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                              >
                                Country: {elem.country}
                              </p>
                              <p
                                id="credit-card-text"
                                className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                              >
                                State: {elem.state}
                              </p>
                              <p
                                id="credit-card-text"
                                className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                              >
                                City: {elem.city}
                              </p>
                              <p
                                id="credit-card-text"
                                className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                              >
                                Pin Code: {elem.pinCode}
                              </p>
                              <p
                                id="credit-card-text"
                                className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                              >
                                Address: {elem.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {paymentMethods.map((elem, i) => (
                  <div key={i}>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="credit-card"
                            aria-describedby="credit-card-text"
                            type="radio"
                            name={elem.name}
                            value={elem.value}
                            className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                            onClick={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="ms-4 text-sm">
                          <label
                            htmlFor="credit-card"
                            className="font-medium leading-none text-gray-900 dark:text-white"
                          >
                            {elem.value}
                          </label>
                          <p
                            id="credit-card-text"
                            className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                          >
                            {elem.subText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delivery Methods
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {deliveryMethods.map((elem, i) => (
                  <div key={i}>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="credit-card"
                            aria-describedby="credit-card-text"
                            type="radio"
                            name={elem.name}
                            value={elem.value}
                            className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                            onClick={(e) =>
                              setSelectedDeliveryMethod(elem.label)
                            }
                            required
                          />
                        </div>

                        <div className="ms-4 text-sm">
                          <label
                            htmlFor="credit-card"
                            className="font-medium leading-none text-gray-900 dark:text-white"
                          >
                            {elem.value}
                          </label>
                          <p
                            id="credit-card-text"
                            className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                          >
                            {elem.subText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="voucher"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                {" "}
                Enter a gift card, voucher or promotional code{" "}
              </label>
              <div className="flex max-w-md items-center gap-4">
                <input
                  type="text"
                  id="voucher"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder=""
                />
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <div className="flow-root">
              <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                <dl className="flex items-center justify-between gap-4 py-8">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Subtotal
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    $ {totalAmountBeforeDiscount?.toFixed(2)}
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Savings
                  </dt>
                  <dd className="text-base font-medium text-green-500">
                    -${savings}
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Store Pickup
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    ${store_pickup_price}
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Tax
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    ${tax_amount}
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    ${final_amount}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className={`flex w-full items-center justify-center rounded-lg  px-5 py-2.5 text-sm font-medium text-white ${
                  selectedPaymentMethod === "" ||
                  selectedDeliveryMethod === "" ||
                  Object.values(selectedAddress).some((value) => value === "")
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-primary-700 hover:bg-primary-800"
                } focus:outline-none focus:ring-4  focus:ring-primary-300 `}
                disabled={
                  selectedPaymentMethod === "" ||
                  selectedDeliveryMethod === "" ||
                  Object.values(selectedAddress).some((value) => value === "")
                }
                onClick={handleOrders}
              >
                Order Now
              </button>
              {(selectedPaymentMethod === "" ||
                Object.values(selectedAddress).some((value) => value === "") ||
                selectedDeliveryMethod === "") && (
                <p className="text-sm text-center text-slate-300">
                  Please complete the following to <strong>Proceed</strong>:
                  <br />
                  {selectedPaymentMethod === "" && (
                    <>
                      - Select a payment method
                      <br />
                    </>
                  )}
                  {selectedDeliveryMethod === "" && (
                    <>
                      - Select a delivery method
                      <br />
                    </>
                  )}
                  {Object.values(selectedAddress).some(
                    (value) => value === ""
                  ) && (
                    <>
                      - Select an address
                      <br />
                    </>
                  )}
                </p>
              )}

              <div className="flex justify-between">
                <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                  <Link
                    to="/"
                    className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping
                  </Link>
                </p>
                <p className="text-sm font-normal text-center  dark:text-white">
                  OR
                </p>
                <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                  <Link
                    to="/cart"
                    className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Go To Cart
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
