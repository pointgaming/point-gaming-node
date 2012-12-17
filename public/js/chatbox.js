$(window).load(function () {
    $("#chatbox").scrollTop($("#chatbox").prop("scrollHeight"));
});

$(function () {
    var socket;

    socket = io.connect();
    socket.on("chat", function (data) {
        var message;

        if (data && data.text) {
            message =  "<p>";
            message += "<strong>" + data.username + ":</strong> ";
            message += data.text;
            message += "</p>";

            $("#chatbox").append(message);
        }
    });

    $("#chatbox-form").submit(function () {
        var field = $("#chatbox-form input"),
            text = field.val();

        if (PointGaming.SessionID) {
            socket.emit("message", {
                sessionID: PointGaming.SessionID,
                text: text
            });
        }

        field.val("");

        return false;
    });
});
