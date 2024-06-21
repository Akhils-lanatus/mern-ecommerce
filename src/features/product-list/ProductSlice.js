import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchAllFilteredProducts } from "./ProductAPI";

const initialState = {
  products: [],
  totalProducts: 0,
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const response = await fetchAllProducts();
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
    return response;
  }
);

export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.totalProducts = action.payload?.length;
      })
      .addCase(fetchAllFilteredProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

const selectAllProducts = (state) => state.product.products;
const getProductsLength = (state) => state.product.totalProducts;
export { selectAllProducts, getProductsLength };

export default productsSlice.reducer;
