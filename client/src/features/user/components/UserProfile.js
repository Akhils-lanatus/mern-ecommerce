import React from "react";
import LoadingPage from "../../../pages/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoggedInUserInfo,
  checkIsLoading,
  removeUserAddressAsync,
} from "../userSlice";
import Navbar from "../../../features/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/showToast";
const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getLoggedInUserInfo);
  const isLoading = useSelector(checkIsLoading);
  const { name = "", email = "", addresses = [] } = user?.data || {};

  const handleEditAddress = (i) => {
    navigate(`/update-address/${i}`);
  };

  const handleRemoveAddress = (index) => {
    const confirm = window.confirm("Are you sure you want to delete address?");
    if (confirm) {
      const updatedUser = { ...user };
      const addresses = [...user?.data?.addresses];
      addresses?.splice(index, 1);
      updatedUser.data = {
        ...user.data,
        addresses: addresses,
      };
      dispatch(removeUserAddressAsync(updatedUser?.data));
      showToast("SUCCESS", "Address removed");
    }
  };

  return (
    <Navbar>
      {isLoading && <LoadingPage loadingMessage="Fetching Details..." />}
      <section className="py-8 antialiased md:py-8">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-3xl font-semibold text-white dark:text-white sm:text-3xl">
            My Profile
          </h2>
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-semibold leading-7 text-white py-6">
              Personal Details
            </h3>
          </div>
          <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-lg font-medium leading-6 text-white">
                  Username
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-400 sm:col-span-1 sm:mt-0">
                  {name}
                </dd>
                <dt className="text-lg font-medium leading-6 text-white">
                  Email address
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-400 sm:col-span-1 sm:mt-0">
                  {email}
                </dd>
              </div>
              <div className="px-4 sm:gap-4 sm:px-0 ">
                <div className="flex justify-between my-4 items-center">
                  <span className="text-xl font-medium leading-6 text-white">
                    Addresses
                  </span>
                  <Link
                    to="/add-address"
                    className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Add Address
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {addresses?.map((elem, i) => (
                      <div key={i}>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                          <div className="sm:grid lg:grid-cols-12 sm:gap-4 items-start">
                            <div className="sm:col-span-8">
                              <div className="ms-4 text-xs">
                                <label
                                  htmlFor="credit-card"
                                  className="font-medium leading-none text-gray-900 dark:text-white"
                                >
                                  Name: {elem.fullName}
                                  <br />
                                  Email: {elem.email}
                                  <br />
                                  Phone: {elem.phone}
                                </label>
                                <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                  Country: {elem.country?.name}
                                </p>
                                <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                  State: {elem.state?.name}
                                </p>
                                <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                  City: {elem.city}
                                </p>
                                <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                  Pin Code: {elem.pinCode}
                                </p>
                                <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                  Address: {elem.address}
                                </p>
                              </div>
                            </div>
                            <div className="sm:col-span-4">
                              <div className="flex justify-around sm:flex-col  mt-4 sm:gap-8 sm:mt-0">
                                <button
                                  onClick={() => handleEditAddress(i)}
                                  className="text-white bg-indigo-600 p-2.5 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-white bg-red-600 p-2.5 rounded-lg"
                                  onClick={() => handleRemoveAddress(i)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </dl>
            <div></div>
          </div>
        </div>
      </section>
    </Navbar>
  );
};

export default UserProfile;
