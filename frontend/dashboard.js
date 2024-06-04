const token = window.sessionStorage.getItem("token");

document.getElementById("button-addon2").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = "";
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));

  axios.post(
    `http://localhost:3000/chat/add-chat/${groupId}`,
    {
      message: message,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  ).then(response => {
    fetchNewMessages(groupId); // Fetch new messages after sending a new one
  }).catch(error => {
    console.error("Error sending message:", error);
  });
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
  const storedMessages = getStoredMessages();
  const lastMessage = storedMessages[storedMessages.length - 1];
  const lastMessageId = lastMessage ? lastMessage.id : null;

  axios.get(`http://localhost:3000/chat/get-chat/${groupId}`, {
    params: {
      lastMessageId: lastMessageId,
    },
  }).then((response) => {
    const newMessages = response.data.chats;
    storeMessages(newMessages);
    newMessages.forEach((chat) => {
      showChats(chat);
    });
  }).catch((err) => {
    console.error("Error fetching messages:", err);
  });
}

window.onload = function () {
  window.localStorage.clear();
  const messages = getStoredMessages();
  document.getElementById("chatBox").innerHTML = "";
  messages.forEach((chat) => {
    showChats(chat);
  });

  getGroups();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  if (groupId) {
    fetchNewMessages(groupId);
    setInterval(() => fetchNewMessages(groupId), 1000);
  }
};

function showChats(chat) {
  const ele = document.getElementById("chatBox");
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.textContent = `${chat.user.name}: ${chat.message}`;
  ele.appendChild(cardBody);
}

document.getElementById("groupBtn").addEventListener("click", () => {
  window.location.href = "/group.html";
});

function getGroups() {
  axios.get(`http://localhost:3000/group/get-group`, {
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    response.data.result.forEach((group) => {
      const ele = document.getElementById("groupBox");
      const aEle = document.createElement("a");
      aEle.textContent = group.name;
      aEle.href = `/dashboard.html?groupId=${group.id}`;
      ele.appendChild(aEle);
    });
  }).catch((err) => {
    console.error("Error fetching groups:", err);
  });
}
