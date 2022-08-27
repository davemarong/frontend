import {
  fetchData,
  displayProductDetails,
  getQueryParam,
  createMenu,
} from "./utils.js";

createMenu();
const productId = getQueryParam();
fetchData(`/products/${productId}`, displayProductDetails);
