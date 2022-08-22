import {
  fetchData,
  displayHeroBanner,
  displayFeaturedProducts,
} from "./utils.js";

fetchData("/home", displayHeroBanner);
fetchData("/products", displayFeaturedProducts);
