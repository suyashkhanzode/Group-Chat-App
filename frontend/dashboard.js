const token = window.sessionStorage.getItem('token');
document.getElementById("button-addon2").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = '';
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
  )
});

function getChats(){
    axios.get(`http://localhost:3000/chat/get-chat`)
    .then((response)=>{
       console.log(response.data.chats)
    })
    .catch((err) =>{
    
})
}

window.onload = getChats();
