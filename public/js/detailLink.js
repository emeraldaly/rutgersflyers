function validateEvents(){
  debugger;

var eventsName = $("#eventsName").val();
var eventsAddress = $("#eventsAddress").val();
var eventsAddress2 = $("#eventsAddress2").val();
var eventsPhoneNumber = $("#eventsPhoneNumber").val();
var eventsWebsite = $("#eventsWebsite").val();
var eventsTime = $("#eventsTime").val();
var eventsDate = $("#eventsDate").val();
 if (eventsName  == "" || eventsAddress == "" || eventsAddress2  == "" ||eventsPhoneNumber  == "" ||eventsWebsite  == "" ||eventsTime == "" || eventsDate == "" ){
$(".validateEvents").html("Please enter all fields.")
return false;
  }
}

function validateTransportation(){
  debugger;

var transportationName = $("#transportationName").val();
var transportationAddress = $("#transportationAddress").val();
var transportationAddress2 = $("#transportationAddress2").val();
var transportationPhoneNumber = $("#transportationPhoneNumber").val();
var transportationWebsite = $("#transportationWebsite").val();
 if (transportationName  == "" || transportationAddress == "" || transportationAddress2  == "" ||transportationPhoneNumber  == "" ||transportationWebsite  == ""){
$(".validateTransportation").html("Please enter all fields.")
return false;
  }
}


function validateFood(){
  debugger;

var foodName = $("#foodName").val();
var foodAddress = $("#foodAddress").val();
var foodAddress2 = $("#foodAddress2").val();
var foodPhoneNumber = $("#foodPhoneNumber").val();
var foodWebsite = $("#foodWebsite").val();
 if (foodName  == "" || foodAddress == "" || foodAddress2  == "" ||foodPhoneNumber  == "" ||foodWebsite  == ""){
$(".validateFood").html("Please enter all fields.")
return false;
  }
}

function validateServices(){
  debugger;

var servicesName = $("#servicesName").val();
var servicesAddress = $("#servicesAddress").val();
var servicesAddress2 = $("#servicesAddress2").val();
var servicesPhoneNumber = $("#servicesPhoneNumber").val();
var servicesWebsite = $("#servicesWebsite").val();
 if (servicesName  == "" || servicesAddress == "" || servicesAddress2  == "" ||servicesPhoneNumber  == "" ||servicesWebsite  == ""){
$(".validateServices").html("Please enter all fields.")
return false;
  }
}

  function validateReview(){
    debugger;
    var rating = $ ('input[name=rating]:checked').val();
    var review = $("#review").val();
     if (rating  == undefined || review == "" ){
$(".validateReview").html("Please enter all fields.")
return false;
  }
}
    

  function validateRegister() {
    debugger;
  var registerUsername  = $("#registerUsername ").val();
  var registerFirstname  = $("#registerFirstname").val();
  var registerLastname  = $("#registerLastname").val();
  var registerEmail = $("#registerEmail").val();
  var registerPassword  = $("#registerPassword").val();
 
 if (registerUsername  == "" ||registerFirstname == "" || registerLastname == "" || registerEmail== "" || registerPassword == ""){
$("#registerValid").html("Please enter all fields.")
return false;
  }
}

function validateForm(){
   var loginEmail  = $("#loginEmail").val();
  var loginPassword = $("#loginPassword").val();
 if (loginPassword == "" || loginEmail == ""){
$(".pleaseEnter").html("Please enter all fields.")
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
