import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getLoggedInUser,
  logoutUserAsync as logoutUserAsyncFromAuth,
} from "../auth/AuthSlice";
import { getLoggedInUserCartItems } from "../cart/cartSlice";
import { logoutUserAsync as logoutUserAsyncFromUser } from "../user/userSlice";
import { showToast } from "../../utils/showToast";
import CustomDialog from "../../utils/customDialog";
import { useState } from "react";
const navigation = [
  { name: "Home", to: "/", current: true },
  { name: "Login", to: "/auth/login", current: false },
  { name: "Register", to: "/auth/register", current: false },
  { name: "404 Page", to: "/error", current: false },
];
const userNavigation = [
  { name: "Your Profile", linkTo: "/profile" },
  { name: "Settings", linkTo: "/" },
  { name: "Sign out" },
  { name: "Your Orders", linkTo: "/my-orders" },
  { name: "Change Password", linkTo: "/change-password" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(getLoggedInUser);
  const cartItems = useSelector(getLoggedInUserCartItems);
  const totalItemsInCart = cartItems?.length;
  const isUserNotLoggedIn = loggedInUser?.length === 0;
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    dispatch(logoutUserAsyncFromAuth());
    dispatch(logoutUserAsyncFromUser());
    showToast("SUCCESS", "Successfully Logged Out");
    navigate("/auth/login");
  };
  const user = {
    name: loggedInUser?.data?.name || "Tom Cook",
    email: loggedInUser?.data?.email || "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  return (
    <>
      <div className="sticky min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link to="/" className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )
                            }
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <Link to="/cart">
                        <button
                          type="button"
                          className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                        >
                          <span className="sr-only">View notifications</span>
                          <span className="relative inline-flex items-center justify-center">
                            <ShoppingBagIcon
                              className={`h-6 w-6 ${
                                isUserNotLoggedIn && "cursor-not-allowed"
                              }`}
                              aria-hidden="true"
                            />

                            <span
                              className={`absolute bottom-3 -right-2 inline-flex rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-black ${
                                isUserNotLoggedIn && "cursor-not-allowed"
                              }`}
                            >
                              {totalItemsInCart}
                            </span>
                          </span>
                        </button>
                      </Link>
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </MenuButton>
                        </div>
                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
                            {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                {({ focus }) => (
                                  <Link
                                    to={item?.linkTo}
                                    className={classNames(
                                      focus ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={() => {
                                      item.name === "Sign out" &&
                                        loggedInUser.hasOwnProperty("data") &&
                                        setOpen(true);
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )
                      }
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    <Link to="/cart">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                      >
                        <span className="sr-only">View notifications</span>
                        <span className="relative inline-flex items-center justify-center">
                          <ShoppingBagIcon
                            className={`h-6 w-6 ${
                              isUserNotLoggedIn && "cursor-not-allowed"
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`absolute bottom-3 -right-2 inline-flex rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-black ${
                              isUserNotLoggedIn && "cursor-not-allowed"
                            }`}
                          >
                            {totalItemsInCart}
                          </span>
                        </span>
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Link
                        to={item?.linkTo}
                        key={item.name}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          item.name === "Sign out" &&
                            loggedInUser.hasOwnProperty("data") &&
                            setOpen(true);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          Icon={ArrowRightEndOnRectangleIcon}
          buttonColor="red"
          buttonText="Logout"
          dialogContent="Confirm Logout?"
          dialogTitle="Logout"
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
