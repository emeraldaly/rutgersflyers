
  function validateRegister() {
    debugger;
  var registerUsername  = $("#registerUsername ").val();
  var registerFirstname  = $("#registerFirstname").val();
  var registerLastname  = $("#registerLastname").val();
  var registerEmail = $("#registerEmail").val();
  var registerPassword  = $("#registerPassword").val();
 
 if (registerUsername  == "" ||registerFirstname == "" || registerLastname == "" || registerEmail== "" || registerPassword == ""){
$("#registerValid").html("Please enter all fields")
return false;
  }
}

function validateForm(){
   var loginEmail  = $("#loginEmail").val();
  var loginPassword = $("#loginPassword").val();
 if (loginPassword == "" || loginEmail == ""){
$(".pleaseEnter").html("Please enter all fields")
return false;
  }
}

// console.log(input)
// if (input.length == 0 || input == ""){
// alert("nothing");
// return false;
// }



$(document).ready(function() {
// $(".title").on(click, function() {

$(".createReview").on("click", function(){
// $  (this).closest(".reviewForm").show()
$(".reviewForm").show();
$(this).hide();

})





});
