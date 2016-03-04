
  function validateForm() {
    debugger;
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
