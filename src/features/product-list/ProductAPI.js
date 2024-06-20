export async function fetchAllProducts() {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}

export const fetchAllFilteredProducts = async (filters) => {
  try {
    let queryString = "";
    for (let x in filters) {
      queryString += `${x}=${filters[x]}&`;
    }
    const res = await fetch(`http://localhost:8000/products?${queryString}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
};
