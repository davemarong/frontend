import {
  displayCart,
  fetchData,
  displayProductDetails,
  getQueryParam,
  calculateCartPrice,
  displayCartPrice,
  createMenu,
} from "./utils.js";

createMenu();
const cart = displayCart();
displayCartPrice(cart);
