import React from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { getLoggedInUserInfo } from "../userSlice";
import Navbar from "../../../features/Navbar/Navbar";
const UserProfile = () => {
  const user = useSelector(getLoggedInUserInfo);
  const { name, email } = user?.data;

  return (
    <Navbar>
      <section className="py-8 antialiased md:py-8">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-3xl font-semibold text-white dark:text-white sm:text-3xl">
            My Profile
          </h2>
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-semibold leading-7 text-white py-6">
              Applicant Information
            </h3>
          </div>
          <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Username
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-1 sm:mt-0">
                  {name}
                </dd>
                <dt className="text-sm font-medium leading-6 text-white">
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-1 sm:mt-0">
                  {email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Addresses
                </dt>
                <dd className="mt-2 text-sm text-white sm:col-span-3 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            resume_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </Navbar>
  );
};

export default UserProfile;
