$(window).load(function () {
    $("#chatbox").scrollTop($("#chatbox").prop("scrollHeight"));
});

$(function () {
    var socket;

    socket = io.connect();
    socket.on("chat", function (data) {
        if (data && data.text) {
            $("#chatbox").append("<p>" + data.text + "</p>");
        }
    });

    $("#chatbox-form").submit(function () {
        var field = $("#chatbox-form input"),
            text = field.val();

        socket.emit("message", {
            text: text
        });

        field.val("");

        return false;
    });
});
