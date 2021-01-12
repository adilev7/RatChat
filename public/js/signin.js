const signInForm = document.querySelector("#signin-form");
const signUpBtn = document.querySelector(".secondary-signin");
const tokenKey = "token";

signUpBtn.addEventListener("click", () => {
  window.location.pathname = "/signup.html";
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(signInForm);
  const dataObj = Object.fromEntries(formData);
  login(dataObj);
});

const getJwt = () => {
  return localStorage.getItem(tokenKey);
};

const getCurrentUser = () => {
  return jwtDecode(getJwt());
};

const login = (formData) => {
  /* IMPORTANT - when dealing with POST in fetch: */
  // 1. Must add header "Content-Type": "application/json" if it's an object.
  // 2. Must stringify the request body "body: JSON.stringify(dataObj)"
  // 3. Must convert the fetch response to json "(response) => response.json()"
  fetch("http://localhost:3500/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getJwt(),
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // saveJwt(data.token);
      localStorage.setItem(tokenKey, data.token);
    })
    .then(() => window.location.replace("/"))
    .catch((err) => console.log({ err }));
};

const jwtDecode = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};
