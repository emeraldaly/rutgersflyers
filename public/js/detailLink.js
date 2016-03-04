function validateEvents(){
  debugger;

var venueName = $("#venueName").val();
var venueAddress = $("#venueAddress").val();
var venueAddress2 = $("#venueAddress2").val();
var venuePhoneNumber = $("#venuePhoneNumber").val();
var venueWebsite = $("#venueWebsite").val();
var venueTime = $("#venueTime").val();
var venueDate = $("#venueDate").val();
 if (venueName  == "" || venueAddress == "" || venueAddress2  == "" ||venuePhoneNumber  == "" ||venueWebsite  == "" ||venueTime == "" || venueDate == "" ){
$(".validateEvents").html("Please enter all fields.")
return false;
  }
}

function validateTransportation(){
  debugger;

var venueName = $("#venueName").val();
var venueAddress = $("#venueAddress").val();
var venueAddress2 = $("#venueAddress2").val();
var venuePhoneNumber = $("#venuePhoneNumber").val();
var venueWebsite = $("#venueWebsite").val();
 if (venueName  == "" || venueAddress == "" || venueAddress2  == "" ||venuePhoneNumber  == "" ||venueWebsite  == ""){
$(".validateTransportation").html("Please enter all fields.")
return false;
  }
}


function validateFood(){
  debugger;

var venueName = $("#venueName").val();
var venueAddress = $("#venueAddress").val();
var venueAddress2 = $("#venueAddress2").val();
var venuePhoneNumber = $("#venuePhoneNumber").val();
var venueWebsite = $("#venueWebsite").val();
 if (venueName  == "" || venueAddress == "" || venueAddress2  == "" ||venuePhoneNumber  == "" ||venueWebsite  == ""){
$(".validateFood").html("Please enter all fields.")
return false;
  }
}

function validateServices(){
  debugger;

var venueName = $("#venueName").val();
var venueAddress = $("#venueAddress").val();
var venueAddress2 = $("#venueAddress2").val();
var venuePhoneNumber = $("#venuePhoneNumber").val();
var venueWebsite = $("#venueWebsite").val();
 if (venueName  == "" || venueAddress == "" || venueAddress2  == "" ||venuePhoneNumber  == "" ||venueWebsite  == ""){
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
