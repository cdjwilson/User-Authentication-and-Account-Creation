$(document).ready(() => {
    let usernameCorrect = false;
    let passwordCorrect = false;
    let emailCorret = false;
    $('#username').on('keyup', () => {
        $.get('/usercheck?username=' + $('#username').val(), (response) => {
            if(response.message === "user exists") {
                $('#usernameResponse').text('Username Already Exists');
                $('#submitBtn').prop('disabled', true);
                usernameCorrect = false;
            } else {
                $('#usernameResponse').text('');
                usernameCorrect = true;
                if (usernameCorrect && passwordCorrect && emailCorret) {
                    $('#submitBtn').prop('disabled', false);
                }
            }
        });
    });
    $('#password, #password2').on('keyup', () => {
        if(!($('#password').val() == $('#password2').val()) && $('#password2').val().length > 0) {
            $('#passwordResponse').text("Passwords Don't Match.");
            $('#submitBtn').prop('disabled', true);
            passwordCorrect = false;
        } else if($('#password').val().length < 8 && $('#password2').val().length > 0) {
            $('#passwordResponse').text("Passwords Length Must Be At Least 8.");
            $('#submitBtn').prop('disabled', true);
            passwordCorrect = false;
        } else {
            $('#passwordResponse').text('');
            passwordCorrect = true;
            if (usernameCorrect && passwordCorrect && emailCorret) {
                $('#submitBtn').prop('disabled', false);
            }
        }
    });
    $('#email').on('keyup', () => {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!(re.test($('#email').val()))) {
            $('#emailResponse').text('Not A Proper Email');
            $('#submitBtn').prop('disabled', false);
            emailCorrect = false;
        } else {
            $.get('/emailcheck?email=' + $('#email').val(), (response) => {
                if(response.message === "email exists") {
                    $('#emailResponse').text('Account With That Email Already Exists');
                    $('#submitBtn').prop('disabled', true);
                    emailCorrect = false;
                } else {
                    $('#emailResponse').text('');
                    emailCorrect = true;
                    if (usernameCorrect && passwordCorrect && emailCorret) {
                        $('#submitBtn').prop('disabled', false);
                    }
                }
            });     
        }
    });
});
