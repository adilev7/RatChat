// const tokenKey = "token";

// const getJwt = () => {
//   return localStorage.getItem(tokenKey);
// };

// const getCurrentUser = () => {
//   return jwtDecode(getJwt());
// };

// const logout = () => {
//   localStorage.removeItem(tokenKey);
// };

// const saveJwt = (token) => {
//   localStorage.setItem(tokenKey, token);
// };

// const jwtDecode = (token) => {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map((c) => {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );
//   return JSON.parse(jsonPayload);
// };

// export { getJwt, saveJwt, logout, getCurrentUser };
