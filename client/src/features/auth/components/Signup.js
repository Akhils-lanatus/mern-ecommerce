import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createUserAsync, checkIsLoading } from "../AuthSlice";
import LoadingPage from "../../../pages/Loading";
import { showToast } from "../../../utils/showToast";

import * as Yup from "yup";
const Signup = () => {
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
              Sign up your account
            </h1>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirm_password: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                  .required("Name is required")
                  .max(20, "Max 20 characters are allowed"),
                email: Yup.string()
                  .required("Email is required")
                  .email("Invalid email format"),
                password: Yup.string()
                  .required("Password is required")
                  .min(6, "Enter at least 8 characters")
                  .max(16, "Max 16 characters are allowed"),
                confirm_password: Yup.string()
                  .required("Confirm Password is required")
                  .oneOf([Yup.ref("password"), null], "Passwords didn't match"),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const res = await dispatch(createUserAsync(values));
                  const data = res.payload.data;
                  if (data.success) {
                    showToast("SUCCESS", data.message);
                    navigate("/auth/verify-email");
                    resetForm();
                  } else {
                    showToast("ERROR", data.message);
                  }
                } catch (error) {
                  console.log(`Error while registering user :: ${error} `);
                }
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Name
                  </label>
                  <Field
                    type="name"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your name"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="name" />
                  </p>
                </div>
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
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    autoComplete="off"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="confirm_password" />
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Register
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-medium text-white hover:underline"
                  >
                    Login
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
export default Signup;
