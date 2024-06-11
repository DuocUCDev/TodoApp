$(document).ready(function () {
  // Aquí puedes añadir funcionalidades específicas si las necesitas

  // Validación de formulario de inicio de sesión
  // Consumo de API para iniciar sesión
  $("#loginForm").validate({
    submitHandler: function (form) {
      var data = {
        username: $("#username").val(),
        password: $("#password").val(),
      };
      $.ajax({
        url: "http://localhost:8000/api/token/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
          localStorage.setItem("access", response.access);
          localStorage.setItem("refresh", response.refresh);
          alert("Login successful!");
          window.location.href = "dashboard.html";
        },
        error: function (response) {
          alert("Login failed! Please check your credentials.");
        },
      });
    },
  });

  // Validación de formulario de registro
  $("#registerForm").validate({
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      confirm_password: {
        required: true,
        minlength: 6,
        equalTo: "#password",
      },
    },
    messages: {
      username: "Please enter your username",
      email: "Please enter a valid email address",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 6 characters long",
      },
      confirm_password: {
        required: "Please confirm your password",
        minlength: "Your password must be at least 6 characters long",
        equalTo: "Please enter the same password as above",
      },
    },
    submitHandler: function (form) {
      var data = {
        username: $("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
      };
      $.ajax({
        url: "http://localhost:8000/api/register/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
          alert("Registration successful!");
          window.location.href = "login.html";
        },
        error: function (response) {
          alert("Registration failed! " + response.responseJSON.detail);
        },
      });
    },
  });

  // Cargar susbscripciones
  function loadSubscriptions() {
    var token = localStorage.getItem("access");
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
              subscription.user.username +
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
        alert("Failed to load subscriptions!");
      },
    });
  }

  loadSubscriptions();

  // Validar formulario de suscripción
  $("#subscribeForm").validate({
    submitHandler: function (form) {
      var token = localStorage.getItem("access");
      var subscriptionType = $("#subscriptionType").val();
      var endDate = new Date();

      if (subscriptionType === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (subscriptionType === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      var data = {
        end_date: endDate.toISOString(),
      };

      $.ajax({
        url: "http://localhost:8000/api/subscribe/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token,
        },
        success: function (response) {
          alert("Subscription successful!");
          window.location.href = "subscriptions.html";
        },
        error: function (response) {
          alert("Subscription failed!");
        },
      });
    },
  });

  // Cargar tareas
  var editingTaskId = null;

    function loadTasks() {
        var token = localStorage.getItem('access');
        $.ajax({
            url: 'http://localhost:8000/api/tasks/',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                var taskList = $("#taskList");
                taskList.empty();
                response.forEach(function (task) {
                    var taskItem = `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>${task.title}</h5>
                                <p>${task.description}</p>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-info edit-task" data-id="${task.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-task" data-id="${task.id}">Delete</button>
                            </div>
                        </li>
                    `;
                    taskList.append(taskItem);
                });

                // Add event listeners for edit and delete buttons
                $(".edit-task").click(function () {
                    var taskId = $(this).data('id');
                    editingTaskId = taskId;
                    $.ajax({
                        url: `http://localhost:8000/api/tasks/${taskId}/`,
                        type: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function (task) {
                            $("#taskTitle").val(task.title);
                            $("#taskDescription").val(task.description);
                            $("#taskModal").modal('show');
                        },
                        error: function () {
                            alert('Failed to load task details.');
                        }
                    });
                });

                $(".delete-task").click(function () {
                    var taskId = $(this).data('id');
                    if (confirm('Are you sure you want to delete this task?')) {
                        $.ajax({
                            url: `http://localhost:8000/api/tasks/${taskId}/`,
                            type: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function () {
                                loadTasks();
                            },
                            error: function () {
                                alert('Failed to delete task.');
                            }
                        });
                    }
                });
            },
            error: function () {
                alert('Failed to load tasks!');
            }
        });
    }

    // Load tasks when the page is ready
    if (window.location.pathname.endsWith('dashboard.html')) {
        loadTasks();
    }

    // Show task modal on button click
    $("#addTaskButton").click(function () {
        editingTaskId = null;
        $("#taskForm")[0].reset();
        $("#taskModal").modal('show');
    });

    // Handle task form submission
    $("#taskForm").validate({
        submitHandler: function (form) {
            var token = localStorage.getItem('access');
            var data = {
                title: $("#taskTitle").val(),
                description: $("#taskDescription").val()
            };
            var url = 'http://localhost:8000/api/tasks/';
            var method = 'POST';
            if (editingTaskId) {
                url += editingTaskId + '/';
                method = 'PUT';
            }

            $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function () {
                    $("#taskModal").modal('hide');
                    loadTasks();
                },
                error: function () {
                    alert('Failed to save task.');
                }
            });
        }
    });

});
