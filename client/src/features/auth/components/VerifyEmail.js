import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Cookie from "js-cookie";
import { VerifyEmailAsync, VerifyOtpAsync } from "../AuthSlice";
import { showToast } from "../../../utils/showToast";
import axios from "axios";

const OtpComponent = ({ setIsEmailSent, dispatch }) => {
  const [thirtySecondTimer, setThirtySecondTimer] = useState(30);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOtpSent && thirtySecondTimer > 0) {
      timer = setInterval(() => {
        setThirtySecondTimer((count) => count - 1);
      }, 1000);
    } else if (thirtySecondTimer === 0) {
      setIsOtpSent(false);
    }

    return () => clearInterval(timer);
  }, [isOtpSent, thirtySecondTimer]);

  const handleResendOtp = useCallback(async () => {
    try {
      const res = await axios.get("/auth/resend-verification-link", {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsOtpSent(true);
        setThirtySecondTimer(30);
        showToast("SUCCESS", res.data.message);
      } else {
        showToast("ERROR", res.data.message);
      }
    } catch (err) {
      showToast("ERROR", err.response?.data?.message || "An error occurred");
    }
  }, []);

  const resendText = useMemo(() => {
    return thirtySecondTimer > 0 && isOtpSent
      ? `Resend OTP in ${thirtySecondTimer}s`
      : `Resend OTP`;
  }, [thirtySecondTimer, isOtpSent]);

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Verify Account
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
                  .length(4, "OTP must be of 4 characters"),
              })}
              onSubmit={async (values, { resetForm }) => {
                const { otp } = values;
                try {
                  const res = await dispatch(VerifyOtpAsync({ otp }));
                  if (res?.error) {
                    let error = JSON.parse(res.error.message);
                    showToast("ERROR", error.message);
                    if (error.hasOwnProperty("emailVerify")) {
                      setIsEmailSent(false);
                    }
                  } else if (res?.payload?.success) {
                    showToast("SUCCESS", res.payload.message);
                    navigate("/auth/login");
                  }
                  setIsOtpSent(true);
                } catch (error) {
                  showToast("ERROR", "An unexpected error occurred.");
                }
                resetForm();
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your OTP
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    id="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1234"
                    aria-describedby="otp-error"
                  />
                  <p id="otp-error" className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="otp" />
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Verify OTP
                </button>
              </Form>
            </Formik>
            <div className="inline-flex items-center gap-3 mt-5">
              <p className="text-base font-mono font-semibold tracking-wide text-gray-400">
                {resendText}
              </p>
              <button
                className={`font-sans font-medium text-white hover:underline bg-primary-800 rounded-md p-1.5 px-8 tracking-widest ${
                  thirtySecondTimer > 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={thirtySecondTimer > 0}
                onClick={handleResendOtp}
              >
                Resend
              </button>
            </div>
            <div className="mt-6 inline-flex justify-between w-full">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Goto{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-white hover:underline"
                >
                  Register
                </Link>
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Goto{" "}
                <Link to="/" className="font-medium text-white hover:underline">
                  Home
                </Link>
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Goto{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-white hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EmailComponent = ({ setIsEmailSent, dispatch }) => {
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Verify Account
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Enter Email
            </h1>
            <div className="text-sm text-gray-300 text-center my-3">
              OTP will be sent to entered Email
            </div>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .required("Email is required")
                  .email("Invalid email format"),
              })}
              onSubmit={async (values, { resetForm }) => {
                const { email } = values;
                try {
                  const res = await dispatch(VerifyEmailAsync({ email }));

                  if (res.error) {
                    const error = JSON.parse(res.error.message);
                    showToast("ERROR", error.message);
                  } else if (res.payload) {
                    const errorType = res.payload.success ? "SUCCESS" : "ERROR";
                    showToast(errorType, res.payload.message);
                    setIsEmailSent(true);
                    resetForm();
                  } else {
                    showToast("ERROR", "Unexpected response from the server.");
                  }
                } catch (err) {
                  showToast(
                    "ERROR",
                    err.response?.data?.message ||
                      "An unexpected error occurred."
                  );
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
                    required=""
                  />
                  <p className="text-sm text-red-600 mt-2">
                    <ErrorMessage name="email" />
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Send Otp
                </button>
                <div className="mt-6 inline-flex justify-between w-full">
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Goto{" "}
                    <Link
                      to="/auth/register"
                      className="font-medium text-white hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Goto{" "}
                    <Link
                      to="/"
                      className="font-medium text-white hover:underline"
                    >
                      Home
                    </Link>
                  </p>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Goto{" "}
                    <Link
                      to="/auth/login"
                      className="font-medium text-white hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

const VerifyEmail = () => {
  const hasEmailCookie = Cookie.get("session_same");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const dispatch = useDispatch();
  return Boolean(hasEmailCookie) || isEmailSent ? (
    <OtpComponent dispatch={dispatch} setIsEmailSent={setIsEmailSent} />
  ) : (
    <EmailComponent setIsEmailSent={setIsEmailSent} dispatch={dispatch} />
  );
};
export default VerifyEmail;
