import { unauthorized } from "./javascript/unauthorized.js";
import { registerMode } from "./javascript/registerMode.js";
import { loginMode } from "./javascript/loginMode.js";
import { loggedInMode } from "./javascript/loginMode.js";
import { yourPageMode } from "./javascript/yourPageMode.js";
import { changeTheme } from "./javascript/changeTheme.js";

changeTheme();
registerMode();
loginMode();
let loginPage = document.getElementById("loginPage");

if (sessionStorage.getItem("token")) {
  loggedInMode();
  console.log("logged in");
  loginPage.innerHTML = "Logout";
} else if (sessionStorage.getItem("token") == null) {
  unauthorized();
  console.log("not logged in");
}

let homePage = document.getElementById("homePage");

homePage.addEventListener("click", () => {
  location.reload();
});

if (sessionStorage.getItem("token")) {
  loginPage.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    console.log("logged out");
    loginPage.innerHTML = "Login";

    document.getElementById("login").classList.remove("hidden");
    document.getElementById("register").classList.add("hidden");
    document.getElementById("showRegisterDiv").classList.remove("hidden");
    document.getElementById("booksDiv").classList.add("hidden");
  });
}
