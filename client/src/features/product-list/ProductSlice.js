import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllFilteredProducts,
  fetchAllCategories,
  fetchAllBrands,
  fetchSingleProduct,
  createNewProduct,
  updateProduct,
  removeProduct,
} from "./ProductAPI";

const initialState = {
  products: [],
  totalProducts: 0,
  categories: [],
  brands: [],
  singleProduct: {},
  isLoading: false,
  error: null,
};

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
  async ({ selectedFilters = {}, selectedSort = {}, pagination = {} }) => {
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

//ADMIN-WORKING
export const createNewProductAsync = createAsyncThunk(
  "product/createNewProduct",
  async (productData) => {
    const response = await createNewProduct(productData);
    return response;
  }
);
export const updateProductAsync = createAsyncThunk(
  "product/updateProduct",
  async (productData) => {
    const response = await updateProduct(productData);
    return response;
  }
);
export const removeProductAsync = createAsyncThunk(
  "product/removeProduct",
  async (id) => {
    const response = await removeProduct(id);
    return response;
  }
);

export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setTotalProductsCount: (state, action) => {
      state.totalProducts = action.payload;
    },
    clearSingleProduct: (state) => {
      state.singleProduct = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
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
      .addCase(fetchAllFilteredProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchSingleProductAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleProductAsync.fulfilled, (state, action) => {
        state.singleProduct = action.payload;
        state.isLoading = false;
      })
      .addCase(createNewProductAsync.fulfilled, (state, action) => {
        state.products.push(action.payload?.product);
        state.error = null;
      })
      .addCase(createNewProductAsync.rejected, (state, action) => {
        state.error = JSON.parse(action.error.message);
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (elem) => elem.id === action.payload.id
        );
        state.products.splice(index, 1, action.payload);
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

export const { clearSingleProduct, setTotalProductsCount } =
  productsSlice.actions;

export default productsSlice.reducer;
