document.getElementById('logInForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.post(`http://localhost:3001/user/login`,{
        email : email,
        password : password
    })
    .then((res)=>{
      
       if(res.data.message === "User authenticated successfully.")
       {
       
         const token = res.data.token;
      
         window.sessionStorage.setItem("token",token);
       
         window.location.href = '/dashboard.html'
          
       } 
        
    })
    .catch((err)=>{
        debugger
      
        alert(`${err.response.data.message}`)
    })
})