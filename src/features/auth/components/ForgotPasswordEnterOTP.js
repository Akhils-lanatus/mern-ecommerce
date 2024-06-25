import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ForgotPasswordEnterOTP = () => {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Forgot Password
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Enter OTP
            </h1>
            <Formik
              initialValues={{
                otp: "",
              }}
              validationSchema={Yup.object({
                otp: Yup.string()
                  .required("OTP is required")
                  .min(4, "OTP must be of 4 characters")
                  .max(4, "OTP must be of 4 characters"),
              })}
              onSubmit={(values, { resetForm }) => {
                console.log(values);
                resetForm();
                navigate("/auth/login");
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Otp
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    id="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1234"
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="otp" />
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Send Otp
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Remembered Password ?{" "}
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
export default ForgotPasswordEnterOTP;
