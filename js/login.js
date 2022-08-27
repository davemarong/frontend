import { baseUrl } from "./constants.js";
import {
  displayMessage,
  saveToken,
  setLoggedIn,
  redirectToPage,
} from "./utils.js";
console.log("hei login");
export const logInUser = async (username, password) => {
  console.log("start");
  const url = baseUrl + "/auth/local";

  const data = JSON.stringify({
    identifier: username,
    password: password,
  });

  const options = {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.user) {
      console.log("login success");
      console.log(data);
      saveToken(data.jwt);
      setLoggedIn();
      redirectToPage("products.html");
    }

    if (data.error) {
      console.log("There was an error");
      //   displayMessage("The login was not successful");
    }
  } catch (err) {
    console.log("error");
    // displayMessage("The login was not successful");
  }
};
