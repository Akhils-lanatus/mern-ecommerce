import React from "react";

const Loading = ({ loadingMessage = "Loading..." }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center space-x-4">
          <svg
            className="animate-spin h-8 w-8 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120 12h-4a3.999 3.999 0 00-3.743-3.995L10 9.854m4.93 11.557A8.003 8.003 0 014 12h4a3.999 3.999 0 003.743 3.995L14 14.146"
            ></path>
          </svg>
          <span className="text-2xl font-bold text-gray-700">
            {loadingMessage}.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
