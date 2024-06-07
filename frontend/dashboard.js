const token = window.sessionStorage.getItem("token");
const socket = io('http://localhost:3000', {
  withCredentials: true,
  auth: {
    Authorization: token
  },
  transports: ["websocket"]
});

socket.on("connect_error", (err) => {
  console.error("Connection Error:", err.message);
  console.error("Description:", err.description);
  console.error("Context:", err.context);
});

document.getElementById("button-addon2").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = "";
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  
  socket.emit('sendMessage', { groupId, message });
});

function storeMessages(messages) {
  const maxMessages = 3;
  const storedMessages = getStoredMessages();
  const combinedMessages = [...storedMessages, ...messages];
  const recentMessages = combinedMessages.slice(-maxMessages);
  localStorage.setItem("chatMessages", JSON.stringify(recentMessages));
}

function getStoredMessages() {
  const messages = localStorage.getItem("chatMessages");
  return messages ? JSON.parse(messages) : [];
}

function fetchNewMessages(groupId) {
  socket.emit('getMessage', { groupId });
}

window.onload = function () {
  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  isMemberAdmin();
  
  window.localStorage.clear();
  const messages = getStoredMessages();
  document.getElementById("chatBox").innerHTML = "";
  messages.forEach(showChats);

  getGroups();

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  if (groupId) {
    socket.emit('joinGroup', groupId);
    fetchNewMessages(groupId);
    
    socket.on('newMessage', (chat) => {
      showChats(chat);
    });

    socket.on('receiveNewMessages', (messages) => {
      storeMessages(messages);
      messages.forEach(showChats);
    });
  }

  
};

function showChats(chat) {
  const ele = document.getElementById("chatBox");
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.textContent = `${chat.user.name}: ${chat.message}`;
  cardBody.innerHTML 
  ele.appendChild(cardBody);
}

function getGroups() {
  axios.get('http://localhost:3000/group/get-group', {
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    response.data.result.forEach((group) => {
      const ele = document.getElementById("groupBox");
      const aEle = document.createElement("a");
      aEle.textContent = group.name;
      aEle.href = `/dashboard.html?groupId=${group.id}`;
      ele.appendChild(aEle);
    });
  })
  .catch((err) => {
    console.error("Error fetching groups:", err);
  });
}

document.getElementById('addUserBtn').addEventListener('click', (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById('searchInput').value;
  document.getElementById('searchInput').value = '';

  axios.post(`http://localhost:3000/admin/add-member/${groupId}`, { email })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
});

document.getElementById('removeUserBtn').addEventListener('click', (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById('searchInput').value;
  document.getElementById('searchInput').value = '';

  axios.post(`http://localhost:3000/admin/remove-member/${groupId}`, { email })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
});

document.getElementById('promoteUserBtn').addEventListener('click', (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById('searchInput').value;
  document.getElementById('searchInput').value = '';

  axios.put(`http://localhost:3000/admin/promote-member/${groupId}`, { email })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
});

function isMemberAdmin() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));

  axios.get(`http://localhost:3000/admin/is-admin/${groupId}`, {
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    debugger;
    if (response.data.isAdmin == false) {
      document.getElementById('manageMember').innerHTML = '';
    }
  })
  .catch((err) => {
    console.error("Error checking admin status:", err);
  });
}
