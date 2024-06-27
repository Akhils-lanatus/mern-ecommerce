export async function fetchLoggedInUserOrders(userId) {
  try {
    const res = await fetch("http://localhost:8000/orders?user.id=" + userId);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
