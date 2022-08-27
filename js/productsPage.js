import {
  displayProducts,
  fetchData,
  filterProductsSearch,
  addProduct,
  displayProductsEditMode,
  createMenu,
  getLoggedIn,
} from "./utils.js";

// Fetch products
let products = fetchData("/products", displayProducts);
createMenu();

// If user is not logged in, hide admin features
const loggedIn = getLoggedIn();
if (!loggedIn) {
  document.querySelector(".editProducts_button").style.display = "none";
  document.querySelector(".addProduct").style.display = "none";
}

// When products have been fetched, display products
products.then((res) => {
  document.querySelector(".searchfield").addEventListener("input", (e) => {
    const updatedProducts = filterProductsSearch(e.target.value, res);
    displayProducts(updatedProducts);
  });
  document
    .querySelector(".editProducts_button")
    ?.addEventListener("click", () => {
      displayProductsEditMode(res);
    });
});
document
  .querySelector(".addProduct_button")
  ?.addEventListener("click", addProduct);
