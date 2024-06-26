import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchAllFilteredProducts,
  fetchAllCategories,
  fetchAllBrands,
  fetchSingleProduct,
} from "./ProductAPI";

const initialState = {
  products: [],
  totalProducts: 0,
  categories: [],
  brands: [],
  singleProduct: {},
  isLoading: false,
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const response = await fetchAllProducts();
    return response;
  }
);
export const fetchAllCategoriesAsync = createAsyncThunk(
  "product/fetchAllCategories",
  async () => {
    const response = await fetchAllCategories();
    return response;
  }
);
export const fetchAllBrandsAsync = createAsyncThunk(
  "product/fetchAllBrands",
  async () => {
    const response = await fetchAllBrands();
    return response;
  }
);
export const fetchAllFilteredProductsAsync = createAsyncThunk(
  "product/fetchAllFilteredProducts",
  async ({ selectedFilters, selectedSort, pagination }) => {
    const response = await fetchAllFilteredProducts(
      selectedFilters,
      selectedSort,
      pagination
    );
    return response.data;
  }
);
export const fetchSingleProductAsync = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id) => {
    const response = await fetchSingleProduct(id);
    return response;
  }
);

export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllCategoriesAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllBrandsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllFilteredProductsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalItems;
        state.isLoading = false;
      })
      .addCase(fetchSingleProductAsync.fulfilled, (state, action) => {
        state.singleProduct = action.payload;
      });
  },
});

const selectAllProducts = (state) => state.product.products;
const getProductsLength = (state) => state.product.totalProducts;
const getAllCategories = (state) => state.product.categories;
const getAllBrands = (state) => state.product.brands;
const getSingleProduct = (state) => state.product.singleProduct;
const checkIsLoading = (state) => state.product.isLoading;

export {
  selectAllProducts,
  getProductsLength,
  getAllCategories,
  getAllBrands,
  getSingleProduct,
  checkIsLoading,
};

export default productsSlice.reducer;
