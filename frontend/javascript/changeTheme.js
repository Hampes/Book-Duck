export const changeTheme = () => {
  let changeColorTheme = async () => {
    let response = await axios.get("http://localhost:1333/api/change-theme");

    console.log(response.data.data.attributes.theme);

    if (response.data.data.attributes.theme == "light") {
      document.querySelector("body").classList.add("light");
      document.querySelector("body").classList.remove("dark");
    } else if (response.data.data.attributes.theme == "dark") {
      document.querySelector("body").classList.add("dark");
      document.querySelector("body").classList.remove("light");
    }
  };

  changeColorTheme();
};
