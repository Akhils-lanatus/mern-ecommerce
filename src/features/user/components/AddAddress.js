import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import {
  updateUserAddressAsync,
  getLoggedInUserInfo,
} from "../../user/userSlice";
import { useNavigate } from "react-router-dom";

const AddAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = useSelector(getLoggedInUserInfo);

  return (
    <section className={`bg-white py-8 antialiased dark:bg-gray-900 md:py-8`}>
      <h1 className="text-4xl text-white mx-auto max-w-screen-xl px-4 2xl:px-0">
        Add Address
      </h1>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 ">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
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
                      updateUserAddressAsync({
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
                    navigate("/profile");
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

                      <div className="mt-2">
                        <button
                          type="reset"
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="mt-2">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddAddress;
