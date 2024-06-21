import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE } from "../../app/constants";
import { useSelector } from "react-redux";
import { getProductsLength } from "../product-list/ProductSlice";
import { useEffect } from "react";

const Pagination = ({ page, handlePagination, setPage }) => {
  const totalProducts = useSelector(getProductsLength);
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  useEffect(() => {
    setPage(1);
  }, [totalProducts]);

  return (
    <div className="flex items-center justify-between border-t border-gray-200px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-around sm:hidden">
        <div className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Previous
        </div>
        <div className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Next
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white">
            Showing{" "}
            <span className="font-medium">
              {(page - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {page * ITEMS_PER_PAGE > totalProducts
                ? totalProducts
                : page * ITEMS_PER_PAGE}
            </span>{" "}
            of <span className="font-medium">{totalProducts}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className={`relative inline-flex items-center rounded-s-md px-2 py-2 ring-1 ring-inset  ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                page !== Math.ceil(totalPages / ITEMS_PER_PAGE)
                  ? "text-white hover:bg-white hover:text-black cursor-pointer"
                  : "text-gray-500"
              }`}
            >
              <span className="sr-only">Previous</span>
              <button
                disabled={page === Math.ceil(totalPages / ITEMS_PER_PAGE)}
                onClick={() => setPage(page - 1)}
              >
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
            >
              <span className="sr-only">Next</span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
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
