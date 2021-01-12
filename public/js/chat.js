const chatForm = document.querySelector("#chat-form");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector("#chatInput");
const chatBtn = document.querySelector(".chat-btn");
const logoutBtn = document.querySelector(".logout-btn");
const friendsTab = document.querySelector(".friends-tab");
const chatsTab = document.querySelector(".chats-tab");

/* JWT */
const tokenKey = "token";

/* JWT */
const getJwt = () => {
  return localStorage.getItem(tokenKey);
};

/* JWT */
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

/* JWT */
const getCurrentUser = () => {
  if (getJwt()) {
    return jwtDecode(getJwt());
  }
  console.log("no token provided!");
  window.location.replace("/signin.html");
};

/* USER */
let currentUser = getCurrentUser();

/* USER */
const logout = () => {
  localStorage.removeItem(tokenKey);
  window.location.replace("/signin.html");
};
logoutBtn.addEventListener("click", () => logout());

/* FETCH DATA - friends */
const getFriends = () => {
  fetch("http://localhost:3500/api/user/friends", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getJwt(),
    },
  })
    .then((res) => res.json())
    .then((userFriends) => {
      if (userFriends.length) {
        userFriends.map((friend) => {
          friendsTab.innerHTML += `<div 
          class="collection-item col s12">
          ${friend.username}
          </div>`;
        });
      } else {
        friendsTab.innerHTML += `
        <div 
        class="collection-item col s12">
        <i class="fas fa-plus-circle"></i> 
        Add New Friends 
        </div>
        `;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
getFriends();

/* FETCH DATA - rooms */
const getRooms = () => {
  fetch("http://localhost:3500/api/room/my-rooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getJwt(),
    },
  })
    .then((res) => res.json())
    .then((rooms) => {
      if (rooms.length) {
        rooms.map((room) => {
          // Exclude current user
          room.roomUsers = room.roomUsers.filter(
            (userId) => userId != currentUser._id
          );
          const roomUsers = room.roomUsers.map(async (userId) => {
            const user = await getUser(userId);
            return user.username;
          });
          Promise.all(roomUsers).then((values) => {
            console.log(values);
            chatsTab.innerHTML += `
                <div id="${room._id}" class="collection-item col s12">
                ${values.join(", ")}
                </div>`;
            const roomBtn = document.getElementById(room._id);
            roomBtn.addEventListener("click", () => handleRoomClick(room));
          });
        });
      } else {
        chatsTab.innerHTML += `
        <div class = "collection-item col s12">
          <i class="fas fa-message"></i> Start New Chat
        </div>
        `;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
getRooms();

/* FETCH USER DATA */
const getUser = (userId) => {
  const user = fetch(`http://localhost:3500/api/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getJwt(),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return user;
};

/* SOCKET.IO */
const socket = io();

/* SOCKET.IO */
// socket.emit("roomJoin", currentUser.username);

/* SOCKET.IO */
// Message from server
socket.on("message", (message) => {
  outputMessage(message);
  chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
});

/* EXISTING ROOM CLICK */
// Create/join socket.io room
const handleRoomClick = (room) => {
  socket.emit("roomJoin", { user: currentUser, room });
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get message text (from input#chatInput)
    let msg = e.target.elements.chatInput.value;
    msg = msg.trim();
    // Emit message to server
    socket.emit("chatMessage", { user: currentUser, msg, room });
    // Clear input
    e.target.elements.chatInput.value = "";
    e.target.elements.chatInput.focus();
  });
};

/* CHAT */
// Disable button when no value
chatBtn.disabled = !chatInput.value;
chatInput.addEventListener("keyup", (e) => {
  chatBtn.disabled = !chatInput.value;
});

/* CHAT */
// Message submit
// chatForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   // Get message text (from input#chatInput)
//   let msg = e.target.elements.chatInput.value;
//   msg = msg.trim();
//   // Emit message to server
//   socket.emit("chatMessage", { user: currentUser.username, msg });
//   // Clear input
//   e.target.elements.chatInput.value = "";
//   e.target.elements.chatInput.focus();
// });

/* CHAT */
// Output message to DOM
const outputMessage = (message) => {
  const isCurrentUser = message.user === currentUser.username;
  const div = document.createElement("div");
  div.classList.add(
    "message",
    `${message.user ? (isCurrentUser ? "currentUser" : "distantUser") : "bot"}`
  );
  div.innerHTML = `
  <p class="msgInfo">${message.user || ""}<span>${message.time}</span></p>
  <p class="msgText">${message.text}</p>`;
  chatbox.appendChild(div);
};
