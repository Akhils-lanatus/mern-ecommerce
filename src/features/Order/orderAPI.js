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
export async function fetchCurrentOrders(userId) {
  try {
    const res = await fetch(
      `http://localhost:8000/orders?user.id=${userId}&status=pending`
    );
    const data = await res.json();
    data.sort((a, b) => {
      let dateA = new Date(a.orderDate).getTime();
      let dateB = new Date(b.orderDate).getTime();
      return dateA > dateB ? -1 : 1;
    });
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
