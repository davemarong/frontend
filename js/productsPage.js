import { displayProducts, fetchData, filterProductsSearch } from "./utils.js";

let products = fetchData("/products", displayProducts);

products.then((res) => {
  let searchfield = document
    .querySelector(".searchfield")
    .addEventListener("input", (e) => {
      const updatedProducts = filterProductsSearch(e.target.value, res);
      displayProducts(updatedProducts);
    });
});
