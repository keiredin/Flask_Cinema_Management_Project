const profileDropdown = document.querySelector('.userProfile');
const loginRegister = document.querySelector('.loginRegister');
const emailID = document.querySelector('.emailID');
$(document).ready(function () {
    
   //  Toast.fire({
   //    icon: 'success',
   //    title: 'Signed in successfully'
   //  })
   //#region LoadInTheUserProfileInTheNavBar
   let user = readLoginCookie();
   if(user){
      loginRegister.style.display="none";
      profileDropdown.style.display="block";
      emailID.textContent = user;
   }
   else{
      loginRegister.style.display="block";
      profileDropdown.style.display="none";
   }
   //#endregion

   var i, stop;
      i = 1;
      stop = 7;
      setInterval(function(){
        if (i > stop){
          return;
        }
        $('#len'+(i++)).toggleClass('bounce');
      }, 500)
      
   $(window).scroll(function () {
      if ($(this).scrollTop() < 70) {
         $(".navbar").removeClass("navbarNotSoFat");
      } else {
         $(".navbar").addClass("navbarNotSoFat");
      }
   });
});
$('.navTrigger').click(function () {
   $(this).toggleClass('active');
});
   //#region Logout
   const logOutButton = document.querySelector('.logoutUser');
   logOutButton.addEventListener("click",logOutUser);
   async function logOutUser(){
   eraseLoginCookie();
   // location.reload();
   window.location.href = 'Login.html';
   }
   //#endregion


//   document.querySelector(".navTrigger").addEventListener("click", (e) =>{
//      console.log(e.target.classList);
//      e.target.classList.toggle('active');
//   });

// $(function(){
//    $(document).ready(function(){

//    });
//  });