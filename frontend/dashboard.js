const token = window.sessionStorage.getItem("token");
document.getElementById("button-addon2").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = "";
  axios.post(
    `http://localhost:3000/chat/add-chat`,
    {
      message: message,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
});

function storeMessages(messages) {
  const maxMessages =7;
  const storedMessages = getStoredMessages();
  const combinedMessages = [...storedMessages, ...messages];
  const recentMessages = combinedMessages.slice(-maxMessages);
  localStorage.setItem('chatMessages', JSON.stringify(recentMessages));
}

function getStoredMessages() {
  const messages = localStorage.getItem('chatMessages');
  return messages ? JSON.parse(messages) : [];
}

function fetchNewMessages() {
  const storedMessages = getStoredMessages();
  const lastMessage = storedMessages[storedMessages.length - 1];
  const lastMessageId = lastMessage ? lastMessage.id : null;

  axios
    .get(`http://localhost:3000/chat/get-chat`, {
      params: {
        lastMessageId: lastMessageId,
      }
    })
    .then((response) => {
    
      const newMessages = response.data.chats;
      storeMessages(newMessages);
      newMessages.forEach((chat) => {
        showChats(chat);
      });
    })
    .catch((err) => {});
}

window.onload = function() {
  const messages = getStoredMessages();
  const ele = document.getElementById("chatBox").innerHTML = '';
  messages.forEach((chat) => {
    showChats(chat);
  });
 
  fetchNewMessages();
}

setInterval(fetchNewMessages, 1000);

function showChats(chat) {
  const ele = document.getElementById("chatBox");
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.textContent = `${chat.user.name}: ${chat.message}`;

  ele.appendChild(cardBody);
}

document.getElementById('groupBtn').addEventListener('click',()=>{
    window.location.href = '/group.html'
})