import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Pagination = () => {
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
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">97</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div className="relative inline-flex items-center rounded-l-md px-2 py-2 bg-gray-50 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer">
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5 " aria-hidden="true" />
            </div>
            <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer">
              1
            </div>
            <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0 cursor-pointer">
              2
            </div>

            <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset bg-gray-50 ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer">
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
