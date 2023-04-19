export const registerMode = () => {
  let createUsername = document.getElementById("createUsername");
  let createPassword = document.getElementById("createPassword");
  let createEmail = document.getElementById("createEmail");
  let createButton = document.getElementById("createButton");

  // SKAPAR NY ANVÄNDARE

  let createUser = async () => {
    await axios.post("http://localhost:1333/api/auth/local/register", {
      username: createUsername.value,
      password: createPassword.value,
      email: createEmail.value,
    });
    document.getElementById("register").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
  };
  createButton.addEventListener("click", () => {
    document.getElementById("register").classList.remove("register");
    document.getElementById("login").classList.add("login");

    createUser();
  });

  let registerButton = document.getElementById("registerButton");
  registerButton.addEventListener("click", () => {
    document
      .getElementById("showRegisterDiv")
      .classList.remove("showRegisterDiv");
    document.getElementById("login").classList.remove("login");
    document.getElementById("register").classList.remove("hidden");
    document.getElementById("register").classList.add("register");
    document.getElementById("login").classList.add("hidden");
    document.getElementById("showRegisterDiv").classList.add("hidden");
  });
};
