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
