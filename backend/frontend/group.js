const token = window.sessionStorage.getItem("token");
document.getElementById('groupForm').addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("grpname").value;
  axios.post(
    `http://13.201.0.34:3001/group/add-group`,
    {
      name: name,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((response) =>{
   if(response.data.status == true)
   {
      alert(`Group created Succesfully`)
      window.location.href = '/dashboard.html'
   }
  })
  .catch((err)=>{
    console.log(err)
  })
});
