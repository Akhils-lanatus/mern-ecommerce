export async function fetchAllProducts() {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
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
    const res = await fetch(`http://localhost:8000/products?${queryString}`);
    const data = await res.json();
    const totalItems = await res.headers.get("X-Total-Count");
    return { data: { products: data, totalItems } };
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};

export const fetchSingleProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/products/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};

export const createNewProduct = async (productData) => {
  try {
    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
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
    const response = await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return id;
    }
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};
