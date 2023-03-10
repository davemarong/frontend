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
  document.querySelector(".editProducts_editButton").style.display = "none";
  document.querySelector(".addProduct_container").style.display = "none";
}

// When products have been fetched, display products
products.then((res) => {
  document
    .querySelector(".searchfield_input")
    .addEventListener("input", (e) => {
      const updatedProducts = filterProductsSearch(e.target.value, res);
      displayProducts(updatedProducts);
    });
  document
    .querySelector(".editProducts_editButton")
    ?.addEventListener("click", () => {
      displayProductsEditMode(res);
    });
});
document
  .querySelector(".addProduct_saveButton")
  ?.addEventListener("click", addProduct);
