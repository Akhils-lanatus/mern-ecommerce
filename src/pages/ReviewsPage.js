import React, { useState } from "react";
import { useId } from "react";

const Star = ({ variant }) => {
  const id = useId();

  let c1, c2;
  if (variant === "filled") {
    c1 = "#FBBC05";
    c2 = "#FBBC05";
  } else if (variant === "empty") {
    c1 = "#C4C4C4";
    c2 = "#C4C4C4";
  } else if (variant === "half") {
    c1 = "#FBBC05";
    c2 = "#C4C4C4";
  }

  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M10 0.148438L12.935 6.14144L19.5 7.10844L14.75 11.7704L15.871 18.3564L10 15.2454L4.129 18.3564L5.25 11.7704L0.5 7.10844L7.064 6.14144L10 0.148438Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
};

const Rating = ({ rating, max = 5 }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: Math.floor(rating) }, (_, i) => (
        <Star key={i} variant="filled" />
      ))}
      {!Number.isInteger(rating) && <Star variant="half" />}
      {Array.from({ length: max - Math.ceil(rating) }, (_, i) => (
        <Star key={i} variant="empty" />
      ))}
    </div>
  );
};

const getRatingData = (reviews) => {
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews?.forEach((review) => {
    ratingCounts[review.rating] += 1;
  });

  const totalReviews = reviews?.length;

  return Object.keys(ratingCounts)
    .map((rating) => ({
      rating: Number(rating),
      count: ratingCounts[rating],
      percentage: (ratingCounts[rating] / totalReviews) * 100,
    }))
    .reverse();
};

const ReviewsPage = ({ selectedProduct }) => {
  const ratingData = getRatingData(
    selectedProduct?.reviews && selectedProduct?.reviews
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reviews
            </h2>
            <div className="mt-2 flex items-center gap-2 sm:mt-0">
              <div className="flex items-center gap-0.5">
                <Rating rating={selectedProduct?.rating} />
              </div>
              <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                ({selectedProduct?.rating})
              </p>
              <div className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white">
                {" "}
                {selectedProduct?.reviews?.length} Reviews{" "}
              </div>
            </div>
          </div>
          <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
            <div className="shrink-0 space-y-4">
              <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">
                {selectedProduct?.rating} out of 5
              </p>
              <button
                type="button"
                data-modal-target="review-modal"
                data-modal-toggle="review-modal"
                className="mb-2 me-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={openModal}
              >
                Write a review
              </button>
            </div>
            <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
              {ratingData.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {rating}
                  </p>
                  <svg
                    className="h-4 w-4 shrink-0 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                  <div className="h-1.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full bg-yellow-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-8 shrink-0 text-right text-sm font-medium leading-none text-primary-700 hover:underline dark:text-primary-500 sm:w-auto sm:text-left">
                    {count} <span className="hidden sm:inline">reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
            {selectedProduct?.reviews?.map((review, i) => {
              const reviewDate = new Date(review?.date)?.toLocaleDateString();
              const reviewTime = new Date(review?.date)?.toLocaleTimeString();
              return (
                <div key={i} className="gap-3 pb-6 pt-6 sm:flex sm:items-start">
                  <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                    <div className="flex items-center gap-0.5">
                      <Rating rating={review?.rating} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {review?.reviewerName}
                      </p>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {reviewDate} at {reviewTime}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <svg
                        className="h-5 w-5 text-primary-700 dark:text-primary-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Verified purchase
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      {review?.comment}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Was it helpful to you?
                      </p>
                      <div className="flex items-center">
                        <input
                          id="reviews-radio-1"
                          type="radio"
                          defaultValue=""
                          name="reviews-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          htmlFor="reviews-radio-1"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Yes: 3{" "}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="reviews-radio-2"
                          type="radio"
                          defaultValue=""
                          name="reviews-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          htmlFor="reviews-radio-2"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          No: 0{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <div className="mt-6 text-center">
            <button
              type="button"
              className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              View more reviews
            </button>
          </div> */}
        </div>
      </section>
      {/* Add review modal */}
      <div
        id="review-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`fixed left-0 right-0 top-0 z-50 ${
          !isModalOpen && "hidden"
        } h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 antialiased`}
      >
        <div className="relative max-h-full w-full p-4">
          {/* Modal content */}
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Add a review for:
                </h3>
                <div className="font-medium text-primary-700 hover:underline dark:text-primary-500">
                  {selectedProduct?.title}
                </div>
              </div>
              <button
                type="button"
                className="absolute right-5 top-5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="review-modal"
                onClick={closeModal}
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form className="p-4 md:p-5">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-2"></div>
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Review title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required={true}
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Review description
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required={true}
                    defaultValue={""}
                  />
                  <p className="ms-auto text-xs text-gray-500 dark:text-gray-400">
                    Problems with the product or delivery?{" "}
                    <span className="text-primary-600 hover:underline dark:text-primary-500">
                      Send a report
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Review rating
                  </label>
                  <input
                    type="number"
                    name="title"
                    id="title"
                    min={0}
                    max={5}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required={true}
                  />
                </div>
                <div className="col-span-2">
                  <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Add real photos of the product to help other customers{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      (Optional)
                    </span>
                  </p>
                  <div className="flex w-full items-center justify-center">
                    <label
                      htmlFor="dropzone-file"
                      className="dark:hover:bg-bray-800 flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <svg
                          className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      id="review-checkbox"
                      type="checkbox"
                      defaultValue=""
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                    />
                    <label
                      htmlFor="review-checkbox"
                      className="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      By publishing this review you agree with the{" "}
                      <span className="text-primary-600 hover:underline dark:text-primary-500">
                        terms and conditions
                      </span>
                      .
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                <button
                  type="submit"
                  className="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Add review
                </button>
                <button
                  type="reset"
                  data-modal-toggle="review-modal"
                  className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
