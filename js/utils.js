import { baseUrl } from "./constants.js";

// FETCH FUNCTIONS
export const fetchData = async (endpoint, callback = () => {}) => {
  const response = await fetch(baseUrl + endpoint);
  const result = await response.json();
  console.log(result);
  callback(result);
  return result;
};

// DISPLAY HTML FUNCTIONS
export const displayHeroBanner = (result) => {
  let hero_banner = document.querySelector(".hero_banner");
  hero_banner.src = "http://localhost:1337" + result.hero_banner.url;
};

export const displayFeaturedProducts = (result) => {
  const featuredProducts = filterFeaturedProducts(result);
  let featuredProducts_element = document.querySelector(".featured_products");
  loopThroughProducts(featuredProducts, featuredProducts_element);
};

export const displayProducts = (result) => {
  let productsContainer_element = document.querySelector(".products_container");
  loopThroughProducts(result, productsContainer_element);
};

export const displayCart = () => {
  const cart = getCartFromLocalStorage();
  let cartContainer = document.querySelector(".cart_container");
  if (cart.length > 0) {
    loopThroughProducts(cart, cartContainer);
    return cart;
  }
  cartContainer.textContent = "You have no item in the cart...";
  return cart;
};

export const getQueryParam = () => {
  return new URL(location.href).searchParams.get("id");
};
export const displayProductDetails = (product) => {
  let productContainer_element = document.querySelector(".product_container");
  const imgUrl = baseUrl + product.image.url;
  productContainer_element.innerHTML = `
  <ul>
    <li>${product.title}</li>
    <img src=${imgUrl} width="200px"/>
    <li>${product.description}</li>
    <li>${product.price}</li>
    <button>Add to cart</button>
  </ul>
  `;
  document.querySelector("ul button").addEventListener("click", () => {
    toggleCart(product);
  });
};

// LOCAL STORAGE / CART
export const toggleCart = (product) => {
  const cart = getCartFromLocalStorage();
  const isFound = isProductInCart(cart, product);

  if (isFound) {
    removeFromCart(product);
    return;
  }
  addToCart(product);
};
export const isProductInCart = (cart, product) => {
  const isFound = cart.some((item) => {
    if (item.id === product.id) {
      return true;
    }
    return false;
  });
  return isFound;
};
export const addToCart = (product) => {
  let cart = getCartFromLocalStorage();
  if (!cart) {
    setCartInLocalStorage([product]);
    return;
  }
  const updatedCart = [...cart, product];
  setCartInLocalStorage(updatedCart);
};
export const removeFromCart = (product) => {
  let cart = getCartFromLocalStorage();
  const updatedCart = cart.filter((item) => item.id != product.id);
  setCartInLocalStorage(updatedCart);
};
export const getCartFromLocalStorage = () => {
  let cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
};
export const setCartInLocalStorage = (updatedCart) => {
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

// FILTER FUNCTIONS
export const filterProductsSearch = (value, products) => {
  const lowerCaseValue = value.toLowerCase();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerCaseValue) ||
      product.description.toLowerCase().includes(lowerCaseValue)
  );
};

export const filterFeaturedProducts = (products) => {
  return products.filter((product) => product.featured);
};

// LOOP FUNCTIONS
export const loopThroughProducts = (products, element) => {
  element.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    const imgUrl = baseUrl + products[i].image.url;
    element.innerHTML += `
            <li data-id="${products[i].id}">
              <img data-id="${products[i].id}" src=${imgUrl} width="100px"/>
              ${products[i].title}
              ${products[i].price}
            </li>
            `;
  }
  document
    .querySelectorAll("li")
    .forEach((product) => product.addEventListener("click", goToPage));
};

const goToPage = (e) => {
  document.location.href =
    "/frontend/productDetail.html?id=" + e.target.dataset.id;
};

export const calculateCartPrice = (cart) => {
  return cart.reduce((previous, current) => {
    return previous + current.price;
  }, 0);
};

export const displayCartPrice = (cart) => {
  const price = calculateCartPrice(cart);
  let cartPrice = document.querySelector(".total_price");
  cartPrice.textContent = `${price}`;
};
