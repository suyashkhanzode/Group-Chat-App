const token = window.sessionStorage.getItem("token");
document.getElementById("button-addon2").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = "";
  debugger;
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

setInterval(() => {
  axios
    .get(`http://localhost:3000/chat/get-chat`)
    .then((response) => {
      console.log(response.data.chats)
      const ele = (document.getElementById("chatBox").innerHTML = "");
      response.data.chats.forEach((chat) => {
        showChats(chat);
      });
    })
    .catch((err) => {});
}, 1000);

function showChats(chat) {
  const ele = document.getElementById("chatBox");
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.textContent = `${chat.user.name}:${chat.message}`;

  ele.appendChild(cardBody);
}


