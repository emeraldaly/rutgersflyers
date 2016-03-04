// Validate a phone number field
$( "#form" ).submit(function( event ) {
    var inputtedPhoneNumber = $( "#phone" ).val();
 
    // Match only numbers
    var phoneNumberRegex = /^\d*$/;
 
    // If the phone number doesn't match the regex
    if ( !phoneNumberRegex.test( inputtedPhoneNumber ) ) {
 
        // Usually show some kind of error message here
 
        // Prevent the form from submitting
        event.preventDefault();
    } else {
 
        // Run $.ajax() here
    }
});
