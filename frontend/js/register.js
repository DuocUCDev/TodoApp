$(document).ready(function () {
    $("#registerForm").validate({
        submitHandler: function (form) {
            var data = {
                username: $("#username").val(),
                email: $("#email").val(),
                password: $("#password").val()
            };
            $.ajax({
                url: "http://localhost:8000/api/register/",
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    localStorage.setItem("access", response.access);
                    localStorage.setItem("refresh", response.refresh);
                    alert("Registration successful!");
                    window.location.href = "login.html";
                },
                error: function (response) {
                    alert("Registration failed! " + response.responseJSON.detail);
                }
            });
        }
    });
});
