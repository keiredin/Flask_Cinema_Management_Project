//Check if the user was sent from another page to login first

// const urlParams = new URLSearchParams(window.location.search);
// intent = Number(urlParams.get('LogReq'));
// if(intent==1){
//   const Toast = Swal.mixin({
//     toast: true,
//     position: 'bottom-end',
//     showConfirmButton: false,
//     timer: 1600,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.addEventListener('mouseenter', Swal.stopTimer)
//       toast.addEventListener('mouseleave', Swal.resumeTimer)
//     }
//   })
  
//   Toast.fire({
//     icon: 'info',
//     title: 'You need to login for this action.'
//   })
// }


const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (() => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (() => {
  signupBtn.click();
  return false;
});
var backgrounds = ["b1","b2","b3","b4"];
curIndex = 0;
function changeBackground(){
  document.querySelector("body").id = backgrounds[curIndex];
  curIndex = curIndex < backgrounds.length-1 ? ++curIndex : 0;
}
setInterval(changeBackground,5000);
// //#region SignUp
// const signUpForm = document.querySelector('#signupform'); 
// const signUpEmail = signUpForm.querySelector('.emailform');
// const signUpPassword = signUpForm.querySelector('.password');
// const signUpConfirmPassword = signUpForm.querySelector('.confirmPassword');
// signUpForm.addEventListener('submit', addUser);

// async function addUser(e){
//   e.preventDefault();
//   console.log(signUpForm);
//   if(!(signUpConfirmPassword.value===signUpPassword.value)){
//     swal("Error!", "Password and confirm password do not match!", "error");
//     return;
//   }
//   let response = await SignUpUser(signUpEmail.value,signUpPassword.value);
//   switch(response) {
//     case 1:
//       await SignInUser(signUpEmail.value,signUpPassword.value);
//       window.location.href = 'index.html';
//       // alert("Successfully signedUpUser");
//       // Swal.fire({
//       //   icon: 'error',
//       //   title: 'Oops...',
//       //   text: 'Something went wrong!',
//       //   footer: '<a href>Why do I have this issue?</a>'
//       // })
//       break;
//     case 2:
//       swal("Error!", "This email already belongs to an account!", "error");
//       // alert("Duplicate User")
//       break;
//     case 10:
//       swal("Error!", "An Unknown error occoured, Please refresh the page!", "error");
//       // alert("Unknown Error occurred")
//         break;  
//     // default:
//     //   // code block
//   } 
// }
// //#endregion

// //#region SignIn
// const signInForm = document.querySelector('#signinform'); 
// const signInEmail = signInForm.querySelector('.emailform');
// const signInPassword = signInForm.querySelector('.password');
// const signInConfirmPassword = signInForm.querySelector('.confirmPassword');
// signInForm.addEventListener('submit', logInUser);

// async function logInUser(e){
//   e.preventDefault();
//   let response = await SignInUser(signInEmail.value,signInPassword.value);
//   switch(response) {
//     case 1:
//       // alert("Successfully signedInUser");
//       window.location.href = 'index.html';
//       break;
//     case 2:
//       swal("Error!", "Incorrect username or password!", "error");
//       break;
//     case 10:
//       swal("Error!", "An Unknown error occoured, Please refresh the page!", "error");
//         break;  
//     // default:
//     //   // code block
//   } 
// }
// //#endregion


