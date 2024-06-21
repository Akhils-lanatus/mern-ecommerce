import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchAllFilteredProducts } from "./ProductAPI";

const initialState = {
  products: [],
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
  async ({ selectedFilters, selectedSort }) => {
    const response = await fetchAllFilteredProducts(
      selectedFilters,
      selectedSort
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
      })
      .addCase(fetchAllFilteredProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const selectAllProducts = (state) => state.product.products;

export default productsSlice.reducer;
