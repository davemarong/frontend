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

export const displayProductsEditMode = (result) => {
  let productsContainer_element = document.querySelector(".products_container");
  loopThroughProductsEditMode(result, productsContainer_element);
};
export const displayCart = () => {
  const cart = getCartFromLocalStorage();
  let cartContainer = document.querySelector(".cart_container");
  if (cart.length > 0) {
    loopThroughProducts(cart, cartContainer);
    return cart;
  }
  cartContainer.innerHTML = "<h1>You have no item in the cart...</h1>";
  return cart;
};

export const getQueryParam = () => {
  return new URL(location.href).searchParams.get("id");
};
export const displayProductDetails = (product) => {
  let productContainer_element = document.querySelector(".product_container");
  const imgUrl = baseUrl + product.image.url;
  productContainer_element.innerHTML = `
  <div class="product display_product_container">
    <h1 class="product_title">${product.title}</h1>
    <img class="product_image" src=${imgUrl} width="200px"/>
    <p class="product_description">${product.description}</p>
    <p class="product_price">Price: <b>${product.price}kr</b></p>
    <button class="product_cartButton">Add/remove from cart</button>
  </div>
  `;
  document
    .querySelector(".product_cartButton")
    .addEventListener("click", () => {
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
    const imgUrl = products[i].image?.url
      ? baseUrl + products[i].image?.url
      : products[i].image_url;
    element.innerHTML += `
            <li class="product" >
              <img class="product_image" data-id="${products[i].id}" src=${imgUrl} width="200px"/>
              <p class="product_title">${products[i].title}</p>
              <p class="product_price">${products[i].price}kr</p>
              <button data-id="${products[i].id}" class="product_button">Details</button>
            </li>
            `;
  }
  document
    .querySelectorAll("li .product_button")
    .forEach((product) => product.addEventListener("click", goToPage));
};
export const loopThroughProductsEditMode = (products, element) => {
  console.log(products);
  element.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    const imgUrl = products[i].image?.url
      ? baseUrl + products[i].image?.url
      : products[i].image_url;
    element.innerHTML += `
            <li class="editProduct_${products[i].id} product editProduct">
              <img class="editProduct_image" src=${imgUrl} width="200px"/>
              <div class="editProduct_form">
              <div>
                <label for="title"> Title:
                </label>
                <input id="title" class="editProduct_title" type="text" value="${products[i].title}" />
              </div>
              <div>
                <label for="description"> Description:
                </label>
                <textarea id="description" class="editProduct_description" rows="5">${products[i].description}
                </textarea>
              </div>
              <div>
                <label for="price"> Price:
                </label>
                <input id="price" class="editProduct_price" type="number" value="${products[i].price}" />
              </div>
              <div>
                <label for="imgUrl"> Image url:
                </label>
                <input id="imgUrl" class="editProduct_imageUrl" type="text" value="${products[i].image?.url}" />
              </div>
              <div class="editProduct_featured-container">
                <label for="featured"> Featured: 
                </label>
                <input id="featured" class="editProduct_featured" type="checkbox" value="${products[i].featured}" />
              </div>
              </div>
              <div class="editProduct_button-container">
                <button class="editProduct_deleteButton" data-id="${products[i].id}">Delete</button>
                <button data-id="${products[i].id}" class="editProduct_saveButton">Save</button>
              </div>
            </li>
            <p class="editProduct_message"></p>
            <hr class="editProduct_hr">
            `;
  }
  document
    .querySelectorAll(".editProduct_saveButton")
    .forEach((product) => product.addEventListener("click", editProduct));
  document.querySelectorAll(".editProduct_deleteButton").forEach((product) =>
    product.addEventListener("click", (e) => {
      confirmationDialog(e);
    })
  );
};

const confirmationDialog = (e) => {
  if (confirm("There is not going back. Press OK to delete this product.")) {
    deleteProduct(e);
  }
};
const deleteProduct = async (e) => {
  const token = getToken();

  const url = baseUrl + `/products/${e.target.dataset.id}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.created_at) {
      // displayMessage("Your product has been deleted", ".editProduct_message");
    }
  } catch (err) {
    console.log(err);
  }
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
  if (price > 0) {
    cartPrice.textContent = `The total price is: ${price}kr`;
  }
};

export const displayMessage = (text, selector) => {
  const message = document.querySelector(selector);
  message.textContent = text;
};

export const saveToken = (jwt) => {
  localStorage.setItem("jwt", jwt);
};
export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const validateByLength = (input, length, label) => {
  if (input.value.length < length) {
    displayMessage(
      `${label} must be more than ${length} letters`,
      ".addProduct_message"
    );
    return true;
  }
  return false;
};

// ADD PRODUCT
export const addProduct = async () => {
  const title = document.querySelector(".addProduct_title");
  const description = document.querySelector(".addProduct_description");
  const price = document.querySelector(".addProduct_price");
  const image_url = document.querySelector(".addProduct_imageUrl");
  const featured = document.querySelector(".addProduct_featured");

  const url = baseUrl + "/products";

  displayMessage("", ".addProduct_message");

  if (
    validateByLength(title, 2, "Title") ||
    validateByLength(price, 1, "Price") ||
    validateByLength(image_url, 1, "Image Url") ||
    validateByLength(description, 6, "Description")
  ) {
    return;
  }

  const token = getToken();
  const data = JSON.stringify({
    title: title.value,
    description: description.value,
    price: price.value,
    featured: featured.checked,
    image_url: image_url.value,
    image: {},
  });

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.created_at) {
      displayMessage("Your product has been saved", ".addProduct_message");
    }
  } catch (err) {
    console.log(err);
  }
  return;
};

const editProduct = async (e) => {
  const { id } = e.target.dataset;
  const title = document.querySelector(`.editProduct_${id} .editProduct_title`);
  const description = document.querySelector(
    `.editProduct_${id} .editProduct_description`
  );
  const price = document.querySelector(`.editProduct_${id} .editProduct_price`);
  const imageUrl = document.querySelector(
    `.editProduct_${id} .editProduct_imageUrl`
  );
  const featured = document.querySelector(
    `.editProduct_${id} .editProduct_featured`
  );
  console.log(id);
  console.log(imageUrl.value);
  const url = baseUrl + `/products/${id}`;

  displayMessage("", ".editProduct_message");

  if (
    validateByLength(title, 2, "Title") ||
    validateByLength(price, 1, "Price") ||
    validateByLength(imageUrl, 6, "Image url") ||
    validateByLength(description, 6, "Description")
  ) {
    return;
  }

  const token = getToken();
  const data = JSON.stringify({
    title: title.value,
    description: description.value,
    price: price.value,
    featured: featured.checked,
    image_url: imageUrl.value,
  });

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.created_at) {
      displayMessage("Your product has been saved", ".editProduct_message");
    }
  } catch (err) {
    console.log(err);
  }
  return;
};
export const setLoggedIn = () => {
  sessionStorage.setItem("loggedIn", true);
};
export const getLoggedIn = () => {
  return sessionStorage.getItem("loggedIn");
};
export const redirectToPage = (page) => {
  document.location.href = page;
};
export const logOut = () => {
  sessionStorage.removeItem("loggedIn");
  localStorage.removeItem("jwt");
  redirectToPage("index.html");
};
export const createMenu = () => {
  const loggedIn = getLoggedIn();
  const nav = document.querySelector(".nav_container");
  nav.innerHTML = `
    <div class="logo">
      <img src="/frontend/images/shoeprint.svg" height="50px" />
    </div>
    <ul class="nav">
      <li>
        <a href="./index.html">Home</a>
      </li>
      <li>
        <a href="./products.html">Products</a>
      </li>
      <li>
        <a href="./cart.html">Cart</a>
      </li>
      ${
        loggedIn
          ? `
      <button class="logOut">
        Log out
      </button>
      `
          : `
      <li>
        <a href="./login.html">Log in</a>
      </li>
      `
      }
    </ul>
    <a class="icon">
        <i class="fa fa-bars"></i>
    </a>
    `;
  document.querySelector(".logOut")?.addEventListener("click", logOut);
  document.querySelector(".icon").addEventListener("click", toggleMenu);
};
export const toggleMenu = () => {
  let nav = document.querySelector(".nav");
  if (nav.style.maxHeight === "300px") {
    nav.style.maxHeight = "0px";
  } else {
    nav.style.maxHeight = "300px";
  }
};
