$(document).ready(function () {
    $("#subscribeForm").validate({
        submitHandler: function (form) {
            subscribe();
        }
    });

    function subscribe() {
        var token = localStorage.getItem('access');
        $.ajax({
            url: "http://localhost:8000/api/subscribe/",
            type: "POST",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + token,
            },
            data: JSON.stringify({}),  // No se necesitan datos adicionales
            success: function (response) {
                alert("Subscription successful!");
                window.location.href = "subscriptions.html";
            },
            error: function (response) {
                if (response.status === 401 && response.responseJSON.code === "token_not_valid") {
                    // Try to refresh the token
                    refreshToken(subscribe);
                } else {
                    alert('Subscription failed! ' + response.responseText);
                }
            }
        });
    }
});
