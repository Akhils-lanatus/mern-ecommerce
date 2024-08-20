import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { ProductList } from "./AdminProductList";
import Pagination from "../../Pagination/Pagination";
import {
  fetchAllFilteredProductsAsync,
  getAllBrands,
  getAllCategories,
  checkIsLoading,
  getProductsLength,
} from "../../product-list/ProductSlice";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import LoadingPage from "../../../pages/Loading";
const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  { name: "Price: Low to High", sort: "price", order: "asc", current: false },
  { name: "Price: High to Low", sort: "price", order: "desc", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const ProductHome = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const categories = useSelector(getAllCategories);
  const brands = useSelector(getAllBrands);
  const isLoading = useSelector(checkIsLoading);
  const totalProducts = useSelector(getProductsLength);

  const handleFilter = (e, section, option) => {
    const newFilter = { ...selectedFilters };
    if (section.id !== "category") {
      if (e.target.checked) {
        if (newFilter[section.id]) {
          newFilter[section.id].push(option.value);
        } else {
          newFilter[section.id] = [option.value];
        }
      } else {
        const index = newFilter[section.id]?.indexOf(option.value);
        if (index !== -1) {
          newFilter[section.id].splice(index, 1);
        }
        if (newFilter[section.id]?.length === 0) {
          delete newFilter[section.id];
        }
      }
    } else {
      newFilter[section.id] = option.value;
    }
    setSelectedFilters(newFilter);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const handleSort = (option) => {
    const sort = {
      _sort: option.sort,
      _order: option.order,
    };
    setSelectedSort(sort);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const handlePagination = (page) => {
    setPage(page);
  };

  const filters = [
    {
      id: "category",
      name: "Categories",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(
      fetchAllFilteredProductsAsync({
        selectedFilters,
        selectedSort,
        pagination,
      })
    );
  }, [dispatch, selectedFilters, selectedSort, page]);

  return (
    <div>
      {isLoading && <LoadingPage loadingMessage={"Loading..."} />}
      <div>
        {/* Mobile filter dialog */}
        <Transition show={mobileFiltersOpen}>
          <Dialog
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <TransitionChild
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div className="fixed inset-0 z-40 flex">
              <TransitionChild
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-900 py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-white">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-white"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <DisclosureButton className="flex w-full items-center justify-between px-2 py-3 text-white">
                                <span className="font-medium text-white">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </DisclosureButton>
                            </h3>
                            <DisclosurePanel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type={
                                        section.id === "category"
                                          ? "radio"
                                          : "checkbox"
                                      }
                                      defaultChecked={
                                        section.id === "category"
                                          ? selectedFilters[section.id] ===
                                            option.value
                                          : selectedFilters[
                                              section.id
                                            ]?.includes(option.label)
                                      }
                                      className="h-4 w-4 rounded"
                                      onChange={(e) =>
                                        handleFilter(e, section, option)
                                      }
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-white"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        <main className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0 bg-gray-900">
          <div className="flex items-baseline justify-evenly lg:justify-between border-b border-gray-200 pb-6 pt-12">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-white">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
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
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <MenuItem key={option.name}>
                          {({ focus }) => (
                            <div
                              onClick={() => handleSort(option)}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                focus ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm",
                                "cursor-pointer"
                              )}
                            >
                              {option.name}
                            </div>
                          )}
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-12 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="flex w-full items-center justify-between bg-gray-900 py-3 text-sm text-white">
                            <span className="font-medium text-white">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5 "
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type={
                                    section.id === "category"
                                      ? "radio"
                                      : "checkbox"
                                  }
                                  defaultChecked={
                                    section.id === "category"
                                      ? selectedFilters[section.id] ===
                                        option.value
                                      : selectedFilters[section.id]?.includes(
                                          option.label
                                        )
                                  }
                                  className="h-4 w-4 rounded "
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-white"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductList />
              </div>
            </div>
          </section>
        </main>

        <Pagination
          handlePagination={handlePagination}
          page={page}
          setPage={setPage}
          totalItems={totalProducts}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
};

export default ProductHome;
