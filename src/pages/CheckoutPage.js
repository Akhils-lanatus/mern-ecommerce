import { Country, State, City } from "country-state-city";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const CheckoutPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
      <h1 className="text-4xl text-white mx-auto max-w-screen-xl px-4 2xl:px-0">
        Checkout
      </h1>
      <form className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="your_name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Your name{" "}
                  </label>
                  <input
                    type="text"
                    id="your_name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="your_email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Your email*{" "}
                  </label>
                  <input
                    type="email"
                    id="your_email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="your_number"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Phone Number*{" "}
                  </label>
                  <input
                    type="text"
                    id="your_email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="9876543210"
                    required
                    pattern="[0-9]{10}"
                  />
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
                  <select
                    id="select-country-input-3"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    value={selectedCountry}
                    onChange={(item) => {
                      item.target.value !== 0 &&
                        setSelectedCountry(item.target.value);
                    }}
                  >
                    <option value={0}>Select Country</option>
                    {Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
                  <select
                    id="select-state-input-3"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    value={selectedState}
                    onChange={(item) => {
                      item.target.value !== 0 &&
                        setSelectedState(item.target.value);
                    }}
                  >
                    {!selectedCountry && (
                      <option value={0}>Select Country First</option>
                    )}

                    {selectedState === null && selectedCountry !== null && (
                      <option value={0}>Select A State</option>
                    )}
                    {State?.getStatesOfCountry(selectedCountry).map((item) => (
                      <option key={item.name} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
                  <select
                    id="select-City-input-3"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    value={selectedCity}
                    onChange={(item) => {
                      item.target.value !== 0 &&
                        setSelectedCity(item.target.value);
                    }}
                  >
                    {!selectedState && (
                      <option value={0}>Select State First</option>
                    )}

                    {City?.getCitiesOfState(selectedCountry, selectedState).map(
                      (item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="your_pinCode"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Pin Code{" "}
                  </label>
                  <input
                    type="text"
                    id="your_pinCode"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="380050"
                    required
                  />
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
                  <textarea
                    id="your_address"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Enter your address"
                    required
                    maxLength={80}
                    style={{ height: "calc(2.5rem + 2px)" }}
                  />
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
                    Add new address
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="credit-card"
                        aria-describedby="credit-card-text"
                        type="radio"
                        name="payment-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        defaultChecked
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="credit-card"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        Credit Card{" "}
                      </label>
                      <p
                        id="credit-card-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Pay with your credit card
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="pay-on-delivery"
                        aria-describedby="pay-on-delivery-text"
                        type="radio"
                        name="payment-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="pay-on-delivery"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        Payment on delivery{" "}
                      </label>
                      <p
                        id="pay-on-delivery-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        +$15 payment processing fee
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="paypal-2"
                        aria-describedby="paypal-text"
                        type="radio"
                        name="payment-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="paypal-2"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        Paypal account{" "}
                      </label>
                      <p
                        id="paypal-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Connect to your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delivery Methods
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="fedex"
                        aria-describedby="fedex-text"
                        type="radio"
                        name="delivery-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="fedex"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        Free Delivery
                      </label>
                      <p
                        id="fedex-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Get it by Friday, 13 Dec 2023
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="dhl"
                        aria-describedby="dhl-text"
                        type="radio"
                        name="delivery-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        defaultChecked
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="dhl"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        $15 - Fast Delivery{" "}
                      </label>
                      <p
                        id="dhl-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Get it by Tommorow
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="express"
                        aria-describedby="express-text"
                        type="radio"
                        name="delivery-method"
                        value=""
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>

                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="express"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        {" "}
                        $49 - Express Delivery{" "}
                      </label>
                      <p
                        id="express-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Get it today
                      </p>
                    </div>
                  </div>
                </div>
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
                    $8,094.00
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Savings
                  </dt>
                  <dd className="text-base font-medium text-green-500">0</dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Store Pickup
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    $99
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Tax
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    $199
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    $8,392.00
                  </dd>
                </dl>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Proceed to Payment
              </button>

              <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                Or{" "}
                <Link
                  to="/"
                  className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                >
                  Continue Shopping
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
