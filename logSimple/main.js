$(document).ready(function() {
    $("#loginForm").on("submit", function(event) {
        var isValid = true;

        // Validate username
        if ($("input[name='username']").val().trim() === "") {
            $("#usernameTooltip").text("Por favor, insira seu nome de usuário.").show();
            isValid = false;
        } else {
            $("#usernameTooltip").hide();
        }

        // Validate password
        if ($("input[name='password']").val().trim() === "") {
            $("#passwordTooltip").text("Por favor, insira sua senha.").show();
            isValid = false;
        } else {
            $("#passwordTooltip").hide();
        }

        if (!isValid) {
            event.preventDefault(); // Prevent form from submitting
        }
    });
});
