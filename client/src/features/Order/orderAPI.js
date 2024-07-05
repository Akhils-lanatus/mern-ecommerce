export async function createOrder(order) {
  try {
    const res = await fetch("http://localhost:8000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
export async function fetchAllOrders({ sort, pagination }) {
  try {
    console.log(sort, pagination);
    let queryString = "";
    for (let key in pagination) {
      queryString += `${key}=${pagination[key]}&`;
    }
    for (let x in sort) {
      queryString += `${x}=${sort[x]}&`;
    }
    console.log(`http://localhost:8000/orders?` + queryString);
    const res = await fetch("http://localhost:8000/orders?" + queryString);
    const data = await res.json();
    const totalOrders = await res.headers.get("X-Total-Count");
    return { orders: data, totalOrders: +totalOrders };
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
export async function updateOrderStatus(order) {
  try {
    const response = await fetch(`http://localhost:8000/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
