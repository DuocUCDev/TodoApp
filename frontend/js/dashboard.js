$(document).ready(function () {
    var editingTaskId = null;

    function loadTasks() {
        var token = localStorage.getItem("access");
        if (!token) {
            alert('Please log in first');
            window.location.href = 'login.html';
            return;
        }
        $.ajax({
            url: "http://localhost:8000/api/tasks/",
            type: "GET",
            headers: {
                Authorization: "Bearer " + token,
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
            error: function (response) {
                if (response.status === 401 && response.responseJSON.code === "token_not_valid") {
                    refreshToken(loadTasks);
                } else {
                    alert('Failed to load tasks!');
                }
            }
        });
    }

    if (window.location.pathname.endsWith('dashboard.html')) {
        loadTasks();
    }

    $("#addTaskButton").click(function () {
        editingTaskId = null;
        $("#taskForm")[0].reset();
        $("#taskModal").modal('show');
    });

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
                error: function (response) {
                    if (response.status === 401 && response.responseJSON.code === "token_not_valid") {
                        refreshToken(function () {
                            $("#taskForm").submit();
                        });
                    } else {
                        alert('Failed to save task.');
                    }
                }
            });
        }
    });
});
