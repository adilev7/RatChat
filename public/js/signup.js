const signUpForm = document.querySelector(".signup-form");
const cancelBtn = document.querySelector(".secondary-signup");

cancelBtn.addEventListener("click", () => {
  window.location.pathname = "/";
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);
  const user = Object.fromEntries(formData);
  signup(user);
});

const signup = (formData) => {
  fetch("http://localhost:3500/api/auth/signup", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((doc) => {
      console.log({ doc });
      window.location.replace("/");
    })
    .catch((err) => console.log({ err }));
};
