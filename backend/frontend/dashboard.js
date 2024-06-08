const token = window.sessionStorage.getItem("token");
const socket = io("http://localhost:3000", {
  withCredentials: true,
  auth: {
    Authorization: token,
  },
  transports: ["websocket"],
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

  socket.emit("sendMessage", { groupId, message });
});

function fetchNewMessages(groupId) {
  socket.emit("getMessage", { groupId });
}

window.onload = function () {
  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  isMemberAdmin();

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));

  if (groupId) {
    socket.emit("joinGroup", groupId);
    fetchNewMessages(groupId);

    socket.on("newMessage", (chat) => {
      showChats(chat);
    });

    socket.on("receiveNewMessages", (messages) => {
      messages.forEach(showChats);
    });
  }

  getGroups();
};

function showChats(chat) {
  const chatBox = document.getElementById('chatBox');
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  cardBody.textContent = `${chat.user.name}: ${chat.message}`;
  
  if(chat.files){
    const fileUrls = JSON.parse(chat.files);
    fileUrls.forEach(fileUrl => {
      const fileElement = document.createElement('div');
      fileElement.className = 'chat-file';
      
      if (fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') || fileUrl.endsWith('.ogg')) {
        fileElement.innerHTML = `<video controls><source src="${fileUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
      } else if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.gif')) {
        fileElement.innerHTML = `<img src="${fileUrl}" alt="uploaded image" style="max-width: 100%; height: auto;">`;
      } else {
        fileElement.innerHTML = `<a href="${fileUrl}" target="_blank">View file</a>`;
      }
      
      cardBody.appendChild(fileElement);
    });
  }

  chatBox.appendChild(cardBody);
}

function getGroups() {
  axios
    .get("http://localhost:3000/group/get-group", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      debugger;
      response.data.result.forEach((group) => {
        const ele = document.getElementById("groupBox");
        const div = document.createElement("div");
        const aEle = document.createElement("a");
        aEle.textContent = group.name;
        aEle.href = `/dashboard.html?groupId=${group.id}`;
        div.appendChild(aEle);
        ele.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Error fetching groups:", err);
    });
}

document.getElementById("addUserBtn").addEventListener("click", (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById("searchInput").value;
  document.getElementById("searchInput").value = "";

  axios
    .post(`http://localhost:3000/admin/add-member/${groupId}`, { email })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
});

document.getElementById("removeUserBtn").addEventListener("click", (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById("searchInput").value;
  document.getElementById("searchInput").value = "";

  axios
    .post(`http://localhost:3000/admin/remove-member/${groupId}`, { email })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
});

document.getElementById("promoteUserBtn").addEventListener("click", (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  const email = document.getElementById("searchInput").value;
  document.getElementById("searchInput").value = "";

  axios
    .put(`http://localhost:3000/admin/promote-member/${groupId}`, { email })
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

  axios
    .get(`http://localhost:3000/admin/is-admin/${groupId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.data.isAdmin == false) {
        document.getElementById("manageMember").innerHTML = "";
      }
    })
    .catch((err) => {
      console.error("Error checking admin status:", err);
    });
}

document.getElementById("fileSendBtn").addEventListener("click", () => {
  const file = document.getElementById("fileInput");
  const filesLength = file.files;
  if (filesLength.length == 0) {
    alert("Please select a file to send.");
    return;
  }
  const fileData = new FormData();
  for (let index = 0; index < filesLength.length; index++) {
    fileData.append("files", filesLength[index]);
  }
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = Number(urlParams.get("groupId"));
  axios.post(`http://localhost:3000/file/upload/${groupId}`, fileData, {
    headers: {
      Authorization: token,
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "content-type": "multipart/form-data",
    },
  }).then((response) => {
    alert("File uploaded successfully");
    
  }).catch((err) => {
    alert("Error uploading file");
    console.error(err);
  });
});

document.getElementById('createGroupBtn').addEventListener('click', () => {
  window.location.href = '/group.html';
});
