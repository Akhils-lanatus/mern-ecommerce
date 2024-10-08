import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../../../pages/Loading";
import {
  fetchSingleProductAsync,
  selectAllProducts,
  checkIsLoading as productLoader,
  fetchAllFilteredProductsAsync,
  setTotalProductsCount,
  removeProductAsync,
} from "../../product-list/ProductSlice";
import { StarIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/showToast";
import CustomDialog from "../../../utils/customDialog";
import { ITEMS_PER_PAGE } from "../../../app/constants";
export function ProductList() {
  const [removeProductIndex, setRemoveProductIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const products = useSelector(selectAllProducts);
  const productLoading = useSelector(productLoader);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleFetchSingleProduct = async (id) => {
    await dispatch(fetchSingleProductAsync(id));
    navigate(`/admin/selected-product`);
  };

  const handleRemoveProduct = async () => {
    const res = await dispatch(removeProductAsync(removeProductIndex));

    if (res.payload.success) {
      const totalProducts = res.payload.remainingCount;
      const _page = Math.ceil(totalProducts / ITEMS_PER_PAGE);
      showToast("SUCCESS", res.payload.message);
      dispatch(setTotalProductsCount(totalProducts));
      dispatch(
        fetchAllFilteredProductsAsync({
          pagination: { _page, _limit: ITEMS_PER_PAGE },
        })
      );
    }
  };

  return (
    <div>
      {productLoading && <LoadingPage loadingMessage="Processing..." />}
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 ">
          {products &&
            products?.map((product) => {
              let P = product.price || 100;
              let d = 1 - product.discountPercentage / 100 || 25;
              const priceBeforeDiscount = (P / d).toFixed(2);

              return (
                <div key={product._id}>
                  <div className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={product.thumbnail}
                        alt={product.imageAlt}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-slate-50">
                          <div className="cursor-pointer">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.title?.length > 22
                              ? `${product.title.slice(0, 22)}...`
                              : product.title}
                          </div>
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          <StarIcon className={classNames("h-5 w-5 inline")} />
                          <span className="align-bottom ml-1">
                            {product.rating}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          $ {product.price}
                        </p>
                        <p className="text-sm font-medium text-slate-400 line-through">
                          $ {priceBeforeDiscount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 "
                      onClick={() => handleFetchSingleProduct(product._id)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-primary-300 "
                      onClick={() =>
                        navigate(`/admin/edit-product/${product._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-red-700 px-2 py-2.5 text-sm font-medium  text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-primary-300 "
                      onClick={() => {
                        setRemoveProductIndex(product?._id);
                        setOpen(true);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          Icon={TrashIcon}
          buttonColor="red"
          buttonText="Remove"
          dialogContent="Are you sure you want to delete selected product?"
          dialogTitle="Remove Product"
          onConfirm={handleRemoveProduct}
        />
      )}
    </div>
  );
}
