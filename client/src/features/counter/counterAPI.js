export async function fetchCount() {
  try {
    const res = await fetch("http://localhost:8000");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
