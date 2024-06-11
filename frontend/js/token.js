function refreshToken(callback) {
    var refresh = localStorage.getItem('refresh');
    if (refresh) {
        $.ajax({
            url: "http://localhost:8000/api/token/refresh/",
            type: "POST",
            data: JSON.stringify({ refresh: refresh }),
            contentType: "application/json",
            success: function (response) {
                localStorage.setItem('access', response.access);
                if (callback) callback();
            },
            error: function (response) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = "login.html";
            }
        });
    } else {
        alert("No refresh token available. Please log in again.");
        window.location.href = "login.html";
    }
}
