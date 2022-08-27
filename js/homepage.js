import {
  fetchData,
  displayHeroBanner,
  displayFeaturedProducts,
  createMenu,
} from "./utils.js";

createMenu();
fetchData("/home", displayHeroBanner);
fetchData("/products", displayFeaturedProducts);
