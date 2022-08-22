import { fetchData, displayProductDetails, getQueryParam } from "./utils.js";

const productId = getQueryParam();
fetchData(`/products/${productId}`, displayProductDetails);
