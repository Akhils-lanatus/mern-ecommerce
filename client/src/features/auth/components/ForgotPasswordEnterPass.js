import React from "react";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChangePasswordAsync } from "../AuthSlice";
import { showToast } from "../../../utils/showToast";
const ForgotPasswordEnterPass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = useParams();
  console.log({ id, token });
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Home
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center md:text-2xl dark:text-white">
              Change Password
            </h1>
            <Formik
              initialValues={{
                new_password: "",
                confirm_password: "",
              }}
              validationSchema={Yup.object({
                new_password: Yup.string()
                  .required("New Password is required")
                  .min(6, "Enter at least 6 characters")
                  .max(16, "Max 16 characters are allowed"),
                confirm_password: Yup.string()
                  .required("Please confirm password")
                  .min(6, "Enter at least 6 characters")
                  .max(16, "Max 16 characters are allowed")
                  .oneOf(
                    [Yup.ref("new_password"), null],
                    "Passwords must match"
                  ),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const res = await dispatch(ChangePasswordAsync(values));
                  console.log(res);
                  if (res?.error) {
                    let error = JSON.parse(res.error.message);
                    showToast("ERROR", error.message);
                    if (error.hasOwnProperty("token")) {
                      navigate("/auth/login");
                    }
                  } else if (res?.payload?.success) {
                    showToast("SUCCESS", res.payload.message);
                    navigate("/");
                  }
                } catch (error) {
                  showToast("ERROR", "Password Change Failed, Try again");
                }
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="new_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <Field
                    type="text"
                    name="new_password"
                    id="new_password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="new_password" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="text"
                    name="confirm_password"
                    id="confirm_password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="confirm_password" />
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Change Password
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ForgotPasswordEnterPass;
