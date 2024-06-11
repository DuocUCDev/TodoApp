$(document).ready(function () {
    $("#loginForm").validate({
        submitHandler: function (form) {
            var data = {
                username: $("#username").val(),
                password: $("#password").val()
            };
            $.ajax({
                url: "http://localhost:8000/api/token/",
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    localStorage.setItem("access", response.access);
                    localStorage.setItem("refresh", response.refresh);
                    window.location.href = "dashboard.html";
                },
                error: function (response) {
                    alert("Login failed! Please check your credentials.");
                }
            });
        }
    });
});
