import {
  displayCart,
  fetchData,
  displayProductDetails,
  getQueryParam,
  calculateCartPrice,
  displayCartPrice,
} from "./utils.js";

const cart = displayCart();
displayCartPrice(cart);
