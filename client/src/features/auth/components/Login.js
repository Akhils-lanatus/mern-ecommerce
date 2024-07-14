import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import LoadingPage from "../../../pages/Loading";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync, checkIsLoading } from "../AuthSlice";
import { showToast } from "../../../utils/showToast";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(checkIsLoading);
  return (
    <section>
      {isLoading && (
        <LoadingPage loadingMessage={"Verifying, Please Wait..."} />
      )}

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
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .required("Email is required")
                  .email("Invalid email format"),
                password: Yup.string()
                  .required("Password is required")
                  .min(6, "Enter at least 6 characters")
                  .max(16, "Max 16 characters are allowed"),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const res = await dispatch(loginUserAsync(values));
                  if (res?.error) {
                    let error = JSON.parse(res.error.message);
                    showToast("ERROR", error.message);
                    if (error.hasOwnProperty("emailVerify")) {
                      navigate("/auth/verify-email");
                    }
                  } else if (res?.payload?.success) {
                    showToast("SUCCESS", res.payload.message);
                    navigate("/");
                  }
                } catch (error) {
                  showToast("ERROR", "Login Failed, Try again");
                }
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@service.com"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="email" />
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    autoComplete="off"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="password" />
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to={"/auth/forgot-password-auth-0"}
                    className="text-sm font-medium text-white hover:underline "
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Login
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-white hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
