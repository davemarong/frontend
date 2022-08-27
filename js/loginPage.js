import { logInUser } from "./login.js";
import { displayMessage, createMenu } from "./utils.js";

const username = document.querySelector(".form_username");
const password = document.querySelector(".form_password");
const button = document.querySelector(".form_button");
console.log("hei loginpage");

createMenu();
const validateUserInput = (e) => {
  e.preventDefault();
  if ((username.value.length > 0) & (password.value.length > 0)) {
    logInUser(username.value, password.value);
  } else {
    displayMessage("There is not enough characters in the username/password");
  }
};

button.addEventListener("click", validateUserInput);
