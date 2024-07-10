import axios from "axios";

export async function fetchAllCategories() {
  try {
    const res = await fetch("http://localhost:8000/categories");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
export async function fetchAllBrands() {
  try {
    const res = await fetch("http://localhost:8000/brands");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}

export const fetchAllFilteredProducts = async (filters, sort, pagination) => {
  try {
    let queryString = "";

    if (Object.keys(filters).length) {
      for (let x in filters) {
        if (x !== "category") {
          let allData = filters[x];
          const lastSelectedData = allData[allData?.length - 1];
          queryString += `${x}=${lastSelectedData}&`;
        } else {
          queryString += `${x}=${filters[x]}&`;
        }
      }
    }
    for (let x in sort) {
      queryString += `${x}=${sort[x]}&`;
    }
    for (let x in pagination) {
      queryString += `${x}=${pagination[x]}&`;
    }
    // console.log(`http://localhost:8000/products?${queryString}`);
    const res = await fetch(`/products/fetch-products?${queryString}`);
    const data = await res.json();
    return { data: { products: data.products, totalItems: data.totalCount } };
  } catch (error) {
    console.log(`Error :: ${error}`);
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
    console.log(`Error :: ${error}`);
  }
};

export const createNewProduct = async (productData) => {
  try {
    const res = await axios.post("/products/admin/add-product", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.success) {
      return res.data;
    } else {
      console.log(res);
    }
  } catch (error) {
    const errors = error.response?.data?.error;
    throw new Error(JSON.stringify(errors));
  }
};
export const updateProduct = async (productData) => {
  try {
    const response = await fetch(
      `http://localhost:8000/products/${productData.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};
export const removeProduct = async (id) => {
  try {
    const response = await axios.delete(`/products/admin/delete-product/${id}`);
    if (response.data.success) {
      return response.data;
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};
