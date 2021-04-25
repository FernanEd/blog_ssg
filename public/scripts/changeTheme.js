let currentTheme = localStorage.getItem("site_theme") || "light";

const changeTheme = () => {
  if (currentTheme === "light") {
    currentTheme = "dark";
    btn.innerText = "🌞";
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("site_theme", "light");
  } else {
    currentTheme = "light";
    btn.innerText = "🌙";
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("site_theme", "dark");
  }
};

const btn = document.querySelector("#change-theme-btn");
btn.addEventListener("click", changeTheme);

changeTheme();
