import axios from "axios";
import qs from "qs";
export async function fetchAllCategories() {
  try {
    const res = await axios.get("/category/fetch-categories");
    return res.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}
export async function fetchAllBrands() {
  try {
    const res = await axios.get("/brand/fetch-brands");
    return res.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}

export const fetchAllFilteredProducts = async (filters, sort, pagination) => {
  try {
    let queryString = "";
    let brand = [];

    if (Object.keys(filters).length) {
      for (let x in filters) {
        if (x !== "category") {
          let tempDataToStoreBrands = filters[x];
          brand = tempDataToStoreBrands;
        } else {
          queryString += `${x}=${filters[x]}&`;
        }
      }
    }
    if (Object.keys(sort).length) {
      for (let x in sort) {
        queryString += `${x}=${sort[x]}&`;
      }
    }

    for (let x in pagination) {
      queryString += `${x}=${pagination[x]}&`;
    }
    // console.log(`http://localhost:8000/products?${queryString}`);
    const res = await axios.get(`/products/fetch-products?${queryString}`, {
      params: {
        brand,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    const data = await res.data;
    return { data: { products: data.products, totalItems: data.totalCount } };
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};

export const fetchSingleProduct = async (id) => {
  try {
    const res = await fetch(`/products/single-product/${id}`);
    const data = await res.json();
    if (data.success) {
      return data.product;
    }
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};

export const createNewCategory = async (categoryData) => {
  try {
    const res = await axios.post("/category/add-category", categoryData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};
export const createNewBrand = async (brandData) => {
  try {
    const res = await axios.post("/brand/add-brand", brandData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};
export const createNewProduct = async (productData) => {
  try {
    const res = await axios.post("/products/admin/add-product", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};
export const updateProduct = async (productData) => {
  try {
    const response = await axios.put(
      `/products/admin/update-product`,
      productData
    );
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};
export const removeProduct = async (id) => {
  try {
    const response = await axios.delete(`/products/admin/delete-product/${id}`);
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};
