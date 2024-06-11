$(document).ready(function () {
    function loadSubscriptions() {
        var token = localStorage.getItem("access");
        if (!token) {
            alert('Please log in first');
            window.location.href = 'login.html';
            return;
        }
        $.ajax({
            url: "http://localhost:8000/api/subscriptions/",
            type: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
            success: function (response) {
                var subscriptionList = $("#subscriptionList");
                subscriptionList.empty();
                response.forEach(function (subscription) {
                    var status = subscription.is_active ? "Active" : "Expired";
                    subscriptionList.append(
                        "<tr><td>" +
                        subscription.username +
                        "</td><td>" +
                        subscription.start_date +
                        "</td><td>" +
                        subscription.end_date +
                        "</td><td>" +
                        status +
                        "</td></tr>"
                    );
                });
            },
            error: function (response) {
                if (response.status === 401 && response.responseJSON.code === "token_not_valid") {
                    // Try to refresh the token
                    refreshToken(loadSubscriptions);
                } else {
                    alert('Failed to load subscriptions! ' + response.responseText);
                }
            }
        });
    }

    if (window.location.pathname.endsWith('subscriptions.html')) {
        loadSubscriptions();
    }
});
