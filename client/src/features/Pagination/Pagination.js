import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_ALL_ORDERS } from "../../app/constants";
import { useSelector } from "react-redux";
import {
  getProductsLength,
  selectAllProducts,
} from "../product-list/ProductSlice";
import { useEffect } from "react";
import { getTotalOrders } from "../Order/orderSlice";

const Pagination = ({
  page = 1,
  handlePagination = () => {},
  setPage = () => {},
  isAdmin = false,
}) => {
  const totalProducts = useSelector(getProductsLength);
  const products = useSelector(selectAllProducts);
  const totalOrders = useSelector(getTotalOrders);
  const itemsPerPage = isAdmin ? ITEMS_PER_PAGE_ALL_ORDERS : ITEMS_PER_PAGE;
  const totalPages = isAdmin
    ? Math.ceil(totalOrders / itemsPerPage)
    : Math.ceil(totalProducts / itemsPerPage);
  useEffect(() => {
    if (products.length === 0) {
      if (page > 1) {
        setPage(totalPages);
      } else setPage(1);
    }
  }, [totalProducts]);

  return (
    <div className="flex items-center justify-between border-t border-gray-200px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-evenly sm:hidden">
        <div
          onClick={() => setPage(page - 1)}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium  ${
            page !== Math.ceil(totalPages / itemsPerPage)
              ? "text-white cursor-pointer"
              : "text-gray-500 border-gray-950"
          }`}
        >
          <span className="sr-only">Previous</span>
          <button disabled={page === Math.ceil(totalPages / itemsPerPage)}>
            Previous
          </button>
        </div>
        <div
          className={`ml-1 items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black bg-white `}
        >
          {page}
        </div>
        <div
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium  ${
            page !== totalPages
              ? "text-white cursor-pointer"
              : "text-gray-500 border-gray-950"
          }`}
          onClick={() => setPage(page + 1)}
        >
          <span className="sr-only">Next</span>

          <button disabled={page === totalPages}>Next</button>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white">
            Showing{" "}
            {isAdmin ? (
              <span className="font-medium">
                {(page - 1) * itemsPerPage + 1}
              </span>
            ) : (
              <span className="font-medium">
                {(page - 1) * itemsPerPage + 1}
              </span>
            )}{" "}
            to{" "}
            {isAdmin ? (
              <span className="font-medium">
                {page * itemsPerPage > totalOrders
                  ? totalOrders
                  : page * itemsPerPage}
              </span>
            ) : (
              <span className="font-medium">
                <span className="font-medium">
                  {page * itemsPerPage > totalProducts
                    ? totalProducts
                    : page * itemsPerPage}
                </span>
              </span>
            )}{" "}
            of{" "}
            <span className="font-medium">
              {isAdmin ? totalOrders : totalProducts}
            </span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className={`relative inline-flex items-center rounded-s-md px-2 py-2 ring-1 ring-inset  ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                page !== Math.ceil(totalPages / itemsPerPage)
                  ? "text-white hover:bg-white hover:text-black cursor-pointer"
                  : "text-gray-500"
              }`}
              onClick={() => setPage(page - 1)}
            >
              <span className="sr-only">Previous</span>
              <button disabled={page === Math.ceil(totalPages / itemsPerPage)}>
                <ChevronLeftIcon className="h-5 w-5 " aria-hidden="true" />
              </button>
            </div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((e) => (
              <button
                key={e}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  e === page ? "bg-white text-black" : "text-white"
                } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer hover:bg-white hover:text-black`}
                onClick={() => handlePagination(e)}
              >
                {e}
              </button>
            ))}
            <div
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset  ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                page !== totalPages
                  ? "text-white hover:bg-white hover:text-black cursor-pointer "
                  : "text-gray-500"
              }`}
              onClick={() => setPage(page + 1)}
            >
              <span className="sr-only">Next</span>

              <button disabled={page === totalPages}>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;