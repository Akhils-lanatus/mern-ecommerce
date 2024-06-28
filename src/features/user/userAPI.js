export async function fetchLoggedInUserOrders(userId) {
  try {
    const res = await fetch("http://localhost:8000/orders?user.id=" + userId);
    const data = await res.json();
    data.sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
