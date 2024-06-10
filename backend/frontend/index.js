
document.getElementById('signUpForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phnumber = document.getElementById('phnumber').value;
    const password = document.getElementById('password').value;
    axios.post(`http://13.201.0.34:3001/user/sign-up`,{
        name:name,
        email : email,
        phnumber : phnumber,
        password : password
    })
    .then((res)=>{
        console.log(res);
       window.location.href = "/login.html"
    })
    .catch((err)=>{
        
    })
})